import { eq, sql } from 'drizzle-orm';
import { userTable } from '../../models/schema';
import { db } from '../index.db';
import type { PublicUserInfo, SelectUser } from '../../types';
import type { GiveUserRoleSchema } from '../../schemas';

export const updateUsersRole = async (oldname : string, name : string) : Promise<void> => {
    await db.update(userTable).set({role : sql`(
            SELECT jsonb_agg(
                CASE 
                    WHEN value = ${oldname}::text THEN ${name}::text 
                    ELSE value 
                END
            ) 
            FROM jsonb_array_elements_text(${userTable.role}) AS value
        )`
    }).where(sql`${userTable.role} @> ${JSON.stringify([oldname])}::jsonb`);
}

export const updateUserRole = async (userId : string, roleUpdates : GiveUserRoleSchema) : Promise<Pick<SelectUser, 'role'>> => {
    const updateCase = roleUpdates.roles.map(update => `WHEN value = '${update.oldRole}' THEN '${update.newRole}'`).join(' ');
    const [updatedRole] : Pick<SelectUser, 'role'>[] = await db.update(userTable).set({role : sql`(
            SELECT jsonb_agg(
                CASE 
                    ${sql.raw(updateCase)}
                    ELSE value 
                END
            ) 
            FROM jsonb_array_elements_text(${userTable.role}) AS value
        )`
    }).where(eq(userTable.id, userId)).returning({role : userTable.role});
    return updatedRole;
}

export const selectUsers = async () : Promise<PublicUserInfo[]> => {
    return db.query.userTable.findMany({columns : {password : false}, orderBy : (table, {desc}) => desc(table.createdAt)})
}