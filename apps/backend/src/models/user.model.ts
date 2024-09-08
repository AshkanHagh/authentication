import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const userTable = pgTable('users', {
    id : uuid('id').primaryKey().defaultRandom(),
    name : varchar('name', {length : 256}).notNull(),
    email : varchar('email', {length : 256}).notNull(),
    password : varchar('password', {length : 256}),
    role : jsonb('role').$type<string[]>().default(['basic']),
    image : varchar('image', {length : 500}),
    createdAt : timestamp('created_at', {mode : 'string'}).defaultNow(),
    updatedAt : timestamp('updated_at', {mode : 'string'}).notNull().default(sql`now()`),
}, table => ({
    emailIndex : uniqueIndex('emailIndex').on(table.email), role_index : index('idx_role').using('gin', table.role)
}));

export const selectUserSchema = createSelectSchema(userTable);
export const InsertUserSchema = createInsertSchema(userTable);
export const selectUserPublicInfoSchema = selectUserSchema.omit({password : true, role : true}).extend({
    permissions : z.array(z.string()),
    role : z.array(z.string())
});