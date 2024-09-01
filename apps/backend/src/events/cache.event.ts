import { EventEmitter } from 'node:events';
import type { PublicUserInfo } from '../types';
import { del, hset, sset } from '../database/cache';

export const cacheEvent = new EventEmitter();

cacheEvent.on('insert_user_detail', async (userDetail : PublicUserInfo) => {
    await Promise.all([hset(`user:${userDetail.id}`, userDetail, 604800), hset(`user:${userDetail.email}`, userDetail, 604800)]);
});

export type HandleRefreshTokenCondition = 'insert' | 'delete';
cacheEvent.on('handle_refresh_token', async (userId : string, condition : HandleRefreshTokenCondition, refreshToken? : string) => {
    condition === 'insert' ? await sset(`refresh_token:${userId}`, refreshToken ?? '', 2 * 24 * 60 * 60 * 1000) 
    : await del(`refresh_token:${userId}`)
});