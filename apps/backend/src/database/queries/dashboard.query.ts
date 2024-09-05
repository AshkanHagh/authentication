import { arrayContains, eq } from 'drizzle-orm';
import { userTable } from '../../models/user.model';
import { db } from '../index.db';
import type { PublicUserInfo } from '../../types';

export const updateUsersRole = async (oldname : string, name : string) : Promise<void> => {
    await db.transaction(async trx => {
        const usersRole : {user : Pick<PublicUserInfo, 'id' | 'role'>}[] = await trx.select({user : {id : userTable.id, role : userTable.role}})
        .from(userTable).where(arrayContains(userTable.role, [oldname]));

        await Promise.all(usersRole.map(async ({user}) => {
            let updatedRoles : string[] | undefined = user.role?.filter(role => role !== oldname);
            if(!updatedRoles?.includes(name)) updatedRoles?.push(name);
            await trx.update(userTable).set({role : updatedRoles}).where(eq(userTable.id, user.id));
        }));
    })
}