import { Redis } from 'ioredis';

const redisClient = () => {

    if(process.env.Redis_Url) {
        console.log('Redis connected');
        return process.env.Redis_Url;
    }

    throw new Error('Redis connection failed');
}

export const redis = new Redis(redisClient());