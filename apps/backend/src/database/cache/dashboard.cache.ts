import type { ChainableCommander } from 'ioredis';
import redis from '../../configs/redis.config';
import type { PublicUserInfo } from '../../types';
import { hset } from '.';

export const updateAllCacheUsersRole = async (oldname : string, name : string) => {
    let cursor : string = '0';

    do {
        const [newCursor, keys] : [string, string[]] = await redis.scan(cursor, 'MATCH', 'user:*', 'COUNT', 100);
        const uuidKeys : string[] = keys.filter(key => /user:[0-9a-fA-F-]{36}/.test(key));
        const pipeline : ChainableCommander = redis.pipeline();

        uuidKeys.forEach(key => pipeline.hgetall(key));
        const usersDetail : PublicUserInfo[] = (await pipeline.exec())!.map(data => data[1]) as PublicUserInfo[];

        await Promise.all(usersDetail.map(async user => {
            const modifiedRoleDetail : string[] = user.role?.toString().split(',')!;
            let updatedRoles : string[] | undefined = modifiedRoleDetail.filter(role => role !== oldname);
            if(!updatedRoles?.includes(name)) updatedRoles.push(name);
            await Promise.all([
                hset(`user:${user.id}`, {role : updatedRoles}, 604800), hset(`user:${user.email}`, {role : updatedRoles}, 604800)
            ])
        }))

        cursor = newCursor;
    } while (cursor !== '0');
}