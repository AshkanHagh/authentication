import { EventEmitter } from 'node:events';
import type { PublicUserInfo } from '../types';
import { hset } from '../database/cache';

export const cacheEvent = new EventEmitter();

cacheEvent.on('insert_user_detail', async (userDetail : PublicUserInfo) => {
    await Promise.all([hset(`user:${userDetail.id}`, userDetail, 604800), hset(`user:${userDetail.email}`, userDetail, 604800)]);
});