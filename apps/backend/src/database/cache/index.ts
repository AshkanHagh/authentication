import redis from '../../configs/redis.config';

export const hset = async <T>(hashKey : string, hashValue : T, expireTime? : number) : Promise<void> => {
    if (expireTime) {
        await Promise.all([redis.hset(hashKey, hashValue as string), redis.expire(hashKey, expireTime)]);
    } else {
        await redis.hset(hashKey, hashValue as string);
    }
};

export const hgetall = async <T>(hashKey : string, expireTime? : number) : Promise<T> => {
    if (expireTime) {
        const [hashDetail] = await Promise.all([redis.hgetall(hashKey), redis.expire(hashKey, expireTime)]);
        return hashDetail as T;
    } else {
        return await redis.hgetall(hashKey) as T;
    }
};

export const hget = async <T>(hashKey : string, hashIndex : string, expireTime? : number) : Promise<T> => {
    if (expireTime) {
        const [hashDetail] = await Promise.all([redis.hget(hashKey, hashIndex), redis.expire(hashKey, expireTime)]);
        return hashDetail as T;
    } else {
        return await redis.hget(hashKey, hashIndex) as T;
    }
};

export const incr = async (key : string, expireTime? : number) : Promise<number> => {
    if (expireTime) {
        const [incrDetail] = await Promise.all([redis.incr(key), redis.expire(key, expireTime)]);
        return incrDetail;
    } else {
        return await redis.incr(key);
    }
};

export const getIncr = async <T>(key : string, expireTime? : number) : Promise<T> => {
    if (expireTime) {
        const [incrDetail] = await Promise.all([redis.get(key), redis.expire(key, expireTime)]);
        return incrDetail as T;
    } else {
        return await redis.get(key) as T;
    }
};

export const hmset = async <T>(hashKey : string, hashIndex : string, hashValue : T, expireTime? : number) : Promise<void> => {
    if (expireTime) {
        await Promise.all([redis.hmset(hashKey, hashIndex, JSON.stringify(hashValue)), redis.expire(hashKey, expireTime)]);
    } else {
        await redis.hmset(hashKey, hashIndex, JSON.stringify(hashValue));
    }
};

export const del = async (key : string) : Promise<void> => {
    await redis.del(key);
};

export const hmdel = async (hashKey : string, hashIndex : string) : Promise<void> => {
    await redis.hdel(hashKey, hashIndex);
};

export const sset = async (stringKey : string, stringValue : string, expireTime? : number) : Promise<void> => {
    if (expireTime) {
        await Promise.all([redis.set(stringKey, stringValue), redis.expire(stringKey, expireTime)]);
    } else {
        await redis.set(stringKey, stringValue);
    }
};

export const hmget = async <T>(hashKey : string, hashIndexes : string[], expireTime? : number) => {
    if (expireTime) {
        const [hashValues] = await Promise.all([redis.hmget(hashKey, ...hashIndexes), redis.expire(hashKey, expireTime)]);
        return hashValues as T[];
    } else {
        return await redis.hmget(hashKey, ...hashIndexes) as T[];
    }
};

export const set = async (stringKey : string, value : string, expireTime : number) : Promise<void> => {
    await redis.set(stringKey, value, 'EX', expireTime);
};

export const exists = async (key : string) : Promise<number> => {
    return await redis.exists(key);
};

export const expire = async (key : string, expireTime : number) => {
    await redis.expire(key, expireTime);
}

export * from './dashboard.cache';
export * from './user.cache';