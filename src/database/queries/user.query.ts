import { sql } from 'drizzle-orm';
import { db } from '../db';
import { UserTable } from '../schema';
import type { TInferSelectUser } from '../../types/index.type';

export const findFirstUser = async (email : string) : Promise<TInferSelectUser | undefined> => {
    return await db.query.UserTable.findFirst({
        where : (table, funcs) => funcs.eq(table.email, email),
        extras : {username : sql<string>`lower(${UserTable.username})`.as('username')},
    });
}

export const insertUserAuthInfo = async (email : string, username : string, password : string) : Promise<void> => {
    await db.insert(UserTable).values({email, username, password});
}