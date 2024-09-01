import type { Context, Next } from 'hono';
import { getConnInfo } from 'hono/bun';
import { incr } from '../database/cache';
import { LRUCache } from 'lru-cache';

type IpData = {count  : number, expireAt?  : number};
const cache = new LRUCache<string, IpData>({max : 60 * 1000, ttl : 1000, updateAgeOnGet : true});

export const handelIpRequest = async (currentIpAddress : string) : Promise<void> => {
    const cachedIp : IpData = cache.get(currentIpAddress.toString()) ?? {count : 0};
    cachedIp.count || await incr(`user_ip:${currentIpAddress}`, 604800);
    
    cachedIp.count++;
    cache.set(currentIpAddress.toString(), cachedIp);
    if (cachedIp.count % 100 === 0) await incr(`user_ip:${currentIpAddress}`, 604800);
};

export const setIpAddressToContext = async (context : Context, next : Next) => {
    context.set('userIp', getConnInfo(context).remote?.address);
    await next();
}