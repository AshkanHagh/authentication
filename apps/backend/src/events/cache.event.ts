import { EventEmitter } from 'node:events';
import type { PublicUserInfo, SelectUserWithPermission } from '../types';
import { del, hgetall, hset, sset } from '../database/cache';
import crypto from 'crypto';

export const cacheEvent = new EventEmitter();

export const generateHash = (value : string) : string => {
    return crypto.createHash('sha256').update(value).digest('hex');
}
export const stableStringify = (obj : Record<string, any>) : string => {
    const sortedObj : Record<string, any> = {};
    Object.keys(obj).sort().forEach(key => sortedObj[key] = obj[key]);
    return JSON.stringify(sortedObj);
}

cacheEvent.on('insert_user_detail', async (userDetail : SelectUserWithPermission) => {
    const { permissions,  ...rest } = userDetail;
    const userDetailCache : PublicUserInfo = await hgetall(`user:${userDetail.id}`, 604800);

    const handelCacheInsert = async () => {
        const cacheHash : string = generateHash(stableStringify({...userDetailCache, role : [userDetailCache.role]}));
        const insertDetailHash : string = generateHash(stableStringify(rest));

        if(cacheHash !== insertDetailHash) {
            await Promise.all([hset(`user:${rest.id}`, rest, 604800), hset(`user:${rest.email}`, rest, 604800)]); 
        }
    }
    await handelCacheInsert();
});

export type HandleRefreshTokenCondition = 'insert' | 'delete';
cacheEvent.on('handle_refresh_token', async (userId : string, condition : HandleRefreshTokenCondition, refreshToken? : string) => {
    condition === 'insert' ? await sset(`refresh_token:${userId}`, refreshToken ?? '', 2 * 24 * 60 * 60 * 1000) 
    : await del(`refresh_token:${userId}`)
});