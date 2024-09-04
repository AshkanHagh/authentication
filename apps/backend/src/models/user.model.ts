import { sql } from 'drizzle-orm';
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const userTable = sqliteTable('users', {
    id : text('id').primaryKey().$defaultFn(() => uuid()),
    name : text('name', {length : 255}).notNull(),
    email : text('email', {length : 255}).notNull().unique(),
    password : text('password'),
    role : text('role', {mode : 'json'}).default(['basic']).$type<string[]>(),
    image : text('image'),
    createdAt : text('created_At').default(sql`(current_timestamp)`),
    updatedAt : text('updated_at').default(sql`(current_timestamp)`).$onUpdate(() => sql<string>`(current_timestamp)`)
}, table => ({
    emailIndex : uniqueIndex('emailIndex').on(table.email)
}));

export const selectUserSchema = createSelectSchema(userTable);
export const InsertUserSchema = createInsertSchema(userTable);
export const selectUserPublicInfoSchema = selectUserSchema.omit({password : true, role : true}).and(z.object({
    permissions : z.string().array(),
    role : z.string().array()
}))