import redis from '.';

export const hset = async <T>(hashKey : string, hashValue : T) : Promise<void> => {
    await redis.hset(hashKey, hashValue as string);
};

export const hgetall = async <T>(hashKey : string) : Promise<T> => {
    return await redis.hgetall(hashKey) as T;
}