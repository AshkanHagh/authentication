import redis from '../redis.index';

export const hset = async <T>(hashKey : string, hashValue : T) : Promise<void> => {
    await redis.hset(hashKey, hashValue as string);
};

export const hgetall = async <T>(hashKey : string) : Promise<T> => {
    return await redis.hgetall(hashKey) as T;
}

export const incr = async (key : string) : Promise<number>=> {
    const incrDetail : number = await redis.incr(key);
    await redis.expire(key, 604800);
    return incrDetail;
}

export const getIncr = async <T>(key : string) => {
    return await redis.get(key) as T;
}

export const del = async (key : string) => {
    await redis.del(key);
}