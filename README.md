Проект развернут на <a href="http://avito.artemdev.com/ads">http://avito.artemdev.com</a>

# Модификации бэкенда
Для качественного выполнения задания я внес некоторые изменения в бэкенд:
1. Добавил запросы к LLM, т.к. через фронтенд отправлять запросы небезопасно, ключ будет открыт
2. Добавил id у элементов на запрос /get/items
3. Добавил сортировку по цене

# Настройка LLM
Для настройки LLM нужно в папке back/ создать файл .env и добавить в него строку:
DEEPSEEK_API_KEY=<ключ>

Ключ я передам в форме. Но я сделал на всякий случай моковый ответ, чтобы при отстутствии ключа можно было протестировать фронтенд.

## Запуск проекта

### Через Docker
Из корня проекта:

Перед запуском (локальным) создайте файл `front/.env`:

```dotenv
VITE_API_URL=http://localhost:8080
```

```bash
docker compose up --build
```

После запуска:
- frontend: http://localhost:5173
- backend: http://localhost:8080

Важно: для `back` используется `back/.env` (см. выше "Настройка LLM").

### Без Docker (локально)
Нужно два терминала: один для `back`, второй для `front`.

Перед запуском фронтенда создайте файл `front/.env`:

```dotenv
VITE_API_URL=http://localhost:8080
```

1) Backend:
   (В backend у меня не работал быстро npm, поэтому я использовал yarn)
```bash
cd back
yarn
yarn start
```

2) Frontend:

```bash
cd front
npm install
npm run dev
```

После запуска:
- frontend: http://localhost:5173
- backend: http://localhost:8080

# README по умолчанию:
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
