import type { Context, Next } from 'hono';
import { getConnInfo } from 'hono/bun';
import { exists } from '../database/cache';

const IP_ACTIVITY_PREFIX : string = 'ip_activity';

export const wasIpActiveRecently = async (ip : string) : Promise<boolean> => {
    return await exists(`${IP_ACTIVITY_PREFIX}:${ip}`) ? true : false;
};

export const setIpAddressToContext = async (context : Context, next : Next) => {
    context.set('userIp', getConnInfo(context).remote?.address);
    await next();
}