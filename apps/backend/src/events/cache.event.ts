import { EventEmitter } from 'node:events';
import type { SelectUserWithPermission } from '../types';
import { del, hset, sset } from '../database/cache';

export const cacheEvent = new EventEmitter();

cacheEvent.on('insert_user_detail', async (userDetail : SelectUserWithPermission) => {
    const { permissions,  ...rest } = userDetail;
    await Promise.all([hset(`user:${rest.id}`, rest, 604800), hset(`user:${rest.email}`, rest, 604800)]);
});

export type HandleRefreshTokenCondition = 'insert' | 'delete';
cacheEvent.on('handle_refresh_token', async (userId : string, condition : HandleRefreshTokenCondition, refreshToken? : string) => {
    condition === 'insert' ? await sset(`refresh_token:${userId}`, refreshToken ?? '', 2 * 24 * 60 * 60 * 1000) 
    : await del(`refresh_token:${userId}`)
});