import { FastifyInstance } from 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            DEEPSEEK_API_KEY: string;
            PORT: string;
        };
    }
}