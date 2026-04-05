import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyEnv from '@fastify/env';

import items from 'data/items.json' with { type: 'json' };
import {DeepSeekResponse, Item} from 'src/types.ts';
import {ItemsGetInQuerySchema, ItemUpdateInSchema, MarketPriceResponseSchema} from 'src/validation.ts';
import { treeifyError, ZodError } from 'zod';
import { doesItemNeedRevision } from './src/utils.ts';

const ITEMS = items as Item[];

const schema = {
    type: 'object',
    required: ['DEEPSEEK_API_KEY', 'PORT'],
    properties: {
        DEEPSEEK_API_KEY: { type: 'string' },
        PORT: { type: 'string', default: '8080' },
    }
};

const options = {
    confKey: 'config',
    schema: schema,
    dotenv: true
};





const fastify = Fastify({
  logger: true,
});

await fastify.register(fastifyEnv, options);
const apiKey = fastify.config.DEEPSEEK_API_KEY;

await fastify.register(cors, {
    origin: 'http://localhost:5173', // Разрешаем только ваш фронтенд
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

await fastify.register((await import('@fastify/middie')).default);

// Искуственная задержка ответов, чтобы можно было протестировать состояния загрузки
fastify.use((_, __, next) =>
  new Promise(res => setTimeout(res, 300 + Math.random() * 700)).then(next),
);

// Настройка CORS
fastify.use((_, reply, next) => {
  reply.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

interface ItemGetRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

fastify.get<ItemGetRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);

  if (!Number.isFinite(itemId)) {
    reply
      .status(400)
      .send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }

  const item = ITEMS.find(item => item.id === itemId);

  if (!item) {
    reply
      .status(404)
      .send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }

  return {
    ...item,
    needsRevision: doesItemNeedRevision(item),
  };
});

interface ItemsGetRequest extends Fastify.RequestGenericInterface {
  Querystring: {
    q?: string;
    limit?: string;
    skip?: string;
    categories?: string;
    needsRevision?: string;
  };
}

fastify.get<ItemsGetRequest>('/items', request => {
  const {
    q,
    limit,
    skip,
    needsRevision,
    categories,
    sortColumn,
    sortDirection,
  } = ItemsGetInQuerySchema.parse(request.query);

  const filteredItems = ITEMS.filter(item => {
    return (
      item.title.toLowerCase().includes(q.toLowerCase()) &&
      (!needsRevision || doesItemNeedRevision(item)) &&
      (!categories?.length ||
        categories.some(category => item.category === category))
    );
  });

  return {
    items: filteredItems
      .toSorted((item1, item2) => {
        let comparisonValue = 0;

        if (!sortDirection) return comparisonValue;

        if (sortColumn === 'title') {
          comparisonValue = item1.title.localeCompare(item2.title);
        } else if (sortColumn === 'createdAt') {
          comparisonValue =
            new Date(item1.createdAt).valueOf() -
            new Date(item2.createdAt).valueOf();
        } else if (sortColumn === 'price') {
          comparisonValue = item1.price - item2.price;
        }

        return (sortDirection === 'desc' ? -1 : 1) * comparisonValue;
      })
      .slice(skip, skip + limit)
      .map(item => ({
          //Добавил id
        id: item.id,
        category: item.category,
        title: item.title,
        price: item.price,
        needsRevision: doesItemNeedRevision(item),
      })),
    total: filteredItems.length,
  };
});

interface ItemUpdateRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: string;
  };
}

fastify.put<ItemUpdateRequest>('/items/:id', (request, reply) => {
  const itemId = Number(request.params.id);

  if (!Number.isFinite(itemId)) {
    reply
      .status(400)
      .send({ success: false, error: 'Item ID path param should be a number' });
    return;
  }

  const itemIndex = ITEMS.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    reply
      .status(404)
      .send({ success: false, error: "Item with requested id doesn't exist" });
    return;
  }

  try {
    const parsedData = ItemUpdateInSchema.parse({
      category: ITEMS[itemIndex].category,
      ...(request.body as {}),
    });

    ITEMS[itemIndex] = {
      id: ITEMS[itemIndex].id,
      createdAt: ITEMS[itemIndex].createdAt,
      updatedAt: new Date().toISOString(),
      ...parsedData,
    };

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      reply.status(400).send({ success: false, error: treeifyError(error) });
      return;
    }

    throw error;
  }
});
fastify.post<{ Params: { id: string } }>('/items/:id/market-price', async (request, reply) => {
    const itemId = Number(request.params.id);
    const itemInDb = ITEMS.find(i => i.id === itemId); // Данные из базы

    const currentData = request.body as any;

    if (!itemInDb && !currentData) {
        return reply.status(404).send({ success: false, error: 'Данные не найдены' });
    }

    const title = currentData?.title || itemInDb?.title;
    const currentPrice = currentData?.price || itemInDb?.price;
    const category = currentData?.category || itemInDb?.category;
    const params = currentData?.params || itemInDb?.params;

    const systemPrompt = `
Ты — ведущий аналитик маркетплейсов с доступом к историческим данным продаж. 
Твоя задача: провести объективную оценку рыночной стоимости б/у или нового товара.

ПРАВИЛА ОТВЕТА:
1. Анализируй состояние товара на основе его параметров.
2. Сравнивай текущую цену пользователя с рыночными трендами.
3. Ответ должен быть СТРОГО в формате JSON: 
   {
     "description": "строка с кратким обоснованием на русском языке (до 200 символов)",
     "price": число (цена, которую ты советуешь),
   }

СТИЛЬ ОБОСНОВАНИЯ:
- Будь конкретным (упоминай бренд или ключевые характеристики).
- Если цена завышена — объясни почему и предложи стратегию.
- Если цена отличная — подтверди это.
`;

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: `Проведи анализ:
                        - Товар: "${title}"
                        - Категория: ${category}
                        - Параметры: ${JSON.stringify(params)}
                        - Текущая цена пользователя: ${currentPrice} ₽
                        
                        Выдай вердикт: стоит ли менять цену для быстрой продажи?`
                    },
                ],
                response_format: { type: 'json_object' }
            }),
        });

        const result = (await response.json()) as DeepSeekResponse;
        return JSON.parse(result.choices[0].message.content);
    } catch (error) {
        // Мок для разработки, если API недоступен
        return { price: Math.round(currentPrice * 0.9), description: "Цена снижена на 10% (демо-режим)" };
    }
});


interface SummaryRequest extends Fastify.RequestGenericInterface {
    Params: {
        id: string;
    };
}

fastify.get<SummaryRequest>('/items/:id/streaming-summary', async (request, reply) => {
    const itemId = Number(request.params.id);
    const item = ITEMS.find(i => i.id === itemId);

    if (!item) {
        return reply.status(404).send({ success: false, error: 'Товар не найден' });
    }

    // Настройка заголовков для стриминга (SSE)
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');


    // Если ключа нет
    if (!apiKey) {
        const mockText = `Это отличное предложение! ${item.title} полностью соответствует описанию. Продаю в связи с переездом.`.split(' ');

        for (const word of mockText) {
            const data = JSON.stringify({ content: word + ' ' });
            reply.raw.write(`data: ${data}\n\n`);
            await new Promise(resolve => setTimeout(resolve, 150)); // Имитация задержки
        }
        reply.raw.end();
        return;
    }

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `Ты — профессиональный копирайтер торговых площадок. 
                        Твоя задача: составить привлекательное и честное описание товара.
                        
                        ОГРАНИЧЕНИЯ:
                        - Максимальная длина: 800 символов.
                        - КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать Markdown (никаких **, ##, __, [ ]).
                        - Запрещено использовать заголовки.
                        - Списки оформляй строго через дефис (-).
                        - Пиши только текст описания, без приветствий и лишних пояснений.`                   },
                    {
                        role: 'user',
                        content: `Товар: ${item.title}. Категория: ${item.category}. Характеристики: ${JSON.stringify(item.params)}.`
                    }
                ],
                stream: true,
            }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const json = JSON.parse(line.replace('data: ', ''));
                            const content = json.choices[0]?.delta?.content || '';
                            if (content) {
                                reply.raw.write(`data: ${JSON.stringify({ content })}\n\n`);
                            }
                        } catch (e) {  }
                    }
                }
            }
        }
    } catch (error) {
        fastify.log.error(error);
    } finally {
        reply.raw.end();
    }
});


const parsedPort = Number(process.env.PORT ?? process.env.port ?? 8080);
const port = Number.isFinite(parsedPort) ? parsedPort : 8080;

fastify.listen({ host: '0.0.0.0', port }, function (err, _address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.debug(`Server is listening on port ${port}`);
});

