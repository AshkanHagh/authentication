import type { Context, Next } from 'hono';
import { CatchAsyncError } from '../libs/utils/catchAsyncError';
import { getConnInfo } from 'hono/bun';
import { createBadRequestError } from '../libs/utils/customErrors';
import { incr } from '../database/cache';
import type { ConnInfo } from 'hono/conninfo';

const cache : Map<string, number> = new Map<string, number>();
const CACHE_TTL = 60 * 1000;
const CACHE_MAX_SIZE = 1000;

export const handelIpRequest = CatchAsyncError(async (context : Context, next : Next) => {
    const connInfo : ConnInfo = getConnInfo(context);
    const ip : string | undefined = connInfo?.remote?.address;
    if(!ip) throw createBadRequestError();

    const requestCount : number = cache.get(ip) || await incr(`user_ip:${ip}`);
    cache.set(ip, requestCount);
    setTimeout(() => cache.delete(ip), CACHE_TTL);
    
    if(cache.size > CACHE_MAX_SIZE) cache.delete(cache.keys().next().value);
    context.set('currentUserIp', ip);
    await next();
});

export const checkIpInfo = async (context : Context, next : Next) => {
    context.set('current_user_ip', getConnInfo(context));
    await next();
}