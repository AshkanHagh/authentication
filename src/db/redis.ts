import { Redis } from 'ioredis';

export const redis = new Redis(process.env.Redis_Url as string);