import type { ChainableCommander } from 'ioredis';
import redis from '../../configs/redis.config';
import type { PublicUserInfo } from '../../types';

export const updateAllCacheUsersRole = async (oldname : string, name : string) => {
    let cursor : string = '0';

    do {
        const [newCursor, keys] : [string, string[]] = await redis.scan(cursor, 'MATCH', 'user:*', 'COUNT', 1000);
        const uuidKeys : string[] = keys.filter(key => /user:[0-9a-fA-F-]{36}/.test(key));

        const pipeline : ChainableCommander = redis.pipeline();
        uuidKeys.forEach(key => pipeline.hgetall(key));
        const usersDetail : PublicUserInfo[] = (await pipeline.exec())!.map(data => data[1]) as PublicUserInfo[];

        usersDetail.forEach(user => {
            const modifiedRoleDetail = user.role?.toString().split(',')!;
            let updatedRoles : string[] = modifiedRoleDetail.filter(role => role !== oldname);
            if (!updatedRoles.includes(name)) updatedRoles.push(name);

            pipeline.hset(`user:${user.id}`, {role : updatedRoles});
            pipeline.hset(`user:${user.email}`, {role : updatedRoles});
        });
        await pipeline.exec();

        cursor = newCursor;
    } while (cursor !== '0');
}