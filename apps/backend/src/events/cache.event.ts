import { EventEmitter } from 'node:events';
import type { PublicUserInfo, SelectUserWithPermission } from '../types';
import { del, expire, hgetall, hset, sset } from '../database/cache';
import crypto from 'crypto';

export const cacheEvent = new EventEmitter();

export const generateHash = (value : string) : string => {
    return crypto.createHash('sha256').update(value).digest('hex');
}
export const stableStringify = (obj : Record<string, any>) : string => {
    return JSON.stringify(Object.keys(obj).sort().reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {} as Record<string, string>));
};

export type HandleRefreshTokenCondition = 'insert' | 'delete';
cacheEvent.on('insert_user_detail', async (userDetail : SelectUserWithPermission, condition : HandleRefreshTokenCondition, 
refreshToken? : string) => {
    const { permissions,  ...rest } = userDetail;
    const userDetailCache : PublicUserInfo = await hgetall(`user:${userDetail.id}`);

    const cacheHash : string = generateHash(stableStringify({...userDetailCache, role : [userDetailCache.role]}));
    const insertDetailHash : string = generateHash(stableStringify(rest));

    if(cacheHash !== insertDetailHash) {
        await Promise.all([hset(`user:${rest.id}`, rest, 604800), hset(`user:${rest.email}`, rest, 604800)]);
    }
    await Promise.all([expire(`user:${rest.id}`, 604800), await expire(`user:${rest.email}`, 604800)]);
    cacheEvent.emit('handle_refresh_token', rest.id, condition, refreshToken);
});

cacheEvent.on('handle_refresh_token', async (userId : string, condition : HandleRefreshTokenCondition, refreshToken? : string) => {
    if (condition === 'insert' && refreshToken) {
        await sset(`refresh_token:${userId}`, refreshToken, 2 * 24 * 60 * 60);
    } else if (condition === 'delete') {
        await del(`refresh_token:${userId}`);
    }
});