import type { Context, Next } from 'hono';
import { CatchAsyncError, createBadRequestError } from '../utils';
import { getConnInfo } from 'hono/bun';
import { incr } from '../database/cache';
import type ErrorHandler from '../utils/errorHandler';
import { LRUCache } from 'lru-cache';

type IpData = {count  : number, expireAt?  : number};

const CACHE_TTL = 60 * 1000;
const CACHE_MAX_SIZE = 1000;

const cache = new LRUCache<string, IpData>({max : CACHE_MAX_SIZE, ttl : CACHE_TTL, updateAgeOnGet : true});

export const handelIpRequest = CatchAsyncError(async (context : Context, next : Next) => {
    const currentIpAddress : string | ErrorHandler = getConnInfo(context).remote?.address ?? createBadRequestError();
    
    const cachedIp: IpData = cache.get(currentIpAddress.toString()) ?? { count: 0 };
    cachedIp.count++;

    cache.set(currentIpAddress.toString(), cachedIp);
    if (cachedIp.count % 100 === 0) await incr(`user_ip:${currentIpAddress}`, 604800);

    context.set('currentUserIp', currentIpAddress);
    await next();
});

export const checkIpInfo = async (context : Context, next : Next) => {
    context.set('current_user_ip', getConnInfo(context));
    await next();
}