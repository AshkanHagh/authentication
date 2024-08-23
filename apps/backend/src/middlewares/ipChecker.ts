import type { Context, Next } from 'hono';
import { CatchAsyncError, createBadRequestError } from '../utils';
import { getConnInfo } from 'hono/bun';
import { incr } from '../database/cache';
import type { ConnInfo } from 'hono/conninfo';

const cache : Map<string, {count : number, expireAt : number}> = new Map();
const CACHE_TTL = 60 * 1000;
const CACHE_MAX_SIZE = 1000;

export const handelIpRequest = CatchAsyncError(async (context : Context, next : Next) => {
    const connInfo : ConnInfo = getConnInfo(context);
    const ip : string | undefined = connInfo?.remote?.address;
    if(!ip) throw createBadRequestError();

    const nowTime : number = Date.now();
    let ipData : {count : number, expireAt : number} | undefined = cache.get(ip);

    if(ipData || ipData!.expireAt <= nowTime) {
        ipData!.count++;
        ipData!.expireAt = nowTime + CACHE_TTL;
    }
    await incr(`user_ip:${ip}`, 604800);
    cache.set(ip, {count : 1, expireAt : nowTime + CACHE_TTL});

    if(cache.size > CACHE_MAX_SIZE) cache.delete(cache.keys().next().value);
    context.set('currentUserIp', ip);
    await next();
});

export const checkIpInfo = async (context : Context, next : Next) => {
    context.set('current_user_ip', getConnInfo(context));
    await next();
}