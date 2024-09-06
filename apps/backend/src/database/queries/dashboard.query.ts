import { sql } from 'drizzle-orm';
import { userTable } from '../../models/schema';
import { db } from '../index.db';

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