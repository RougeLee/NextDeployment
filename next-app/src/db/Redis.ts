import Redis from 'ioredis';

export const getRedis = () => {
    const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
    const host = process.env.REDIS_HOST ?? 'localhost';
    const options = {port, host};
    return new Redis(options);
}
