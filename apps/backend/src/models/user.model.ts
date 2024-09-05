import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const userTable = pgTable('users', {
    id : uuid('id').primaryKey().defaultRandom(),
    name : varchar('name', {length : 256}).notNull(),
    email : varchar('email', {length : 256}).notNull().unique(),
    password : varchar('password', {length : 256}),
    role : jsonb('role').$type<string[]>().default(['basic']),
    image : varchar('image', {length : 500}),
    createdAt : timestamp('created_at').defaultNow(),
    updatedAt : timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`now()`)
}, table => ({
    emailIndex : uniqueIndex('emailIndex').on(table.email), roleIndex : index('roleIndex').on(table.role)
}));

export const selectUserSchema = createSelectSchema(userTable);
export const InsertUserSchema = createInsertSchema(userTable);
export const selectUserPublicInfoSchema = selectUserSchema.omit({password : true, role : true}).and(z.object({
    permissions : z.string().array(),
    role : z.string().array()
}));