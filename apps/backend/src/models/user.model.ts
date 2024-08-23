import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { userAnswersTable } from './questions.model';

export const roleEnum = pgEnum('user_role_enum', ['genius-admin', 'genius-user', 'genius-creator']);
export const userTable = pgTable('users', {
    id : uuid('id').primaryKey().defaultRandom(),
    name : varchar('name', {length : 255}),
    email : varchar('email', {length : 255}).notNull(),
    password : text('password'),
    role : roleEnum('role').default('genius-user'),
    image : text('image'),
    createdAt : timestamp('created_at').defaultNow(),
    updatedAt : timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
}, table => ({
    emailIndex : uniqueIndex('email_index').on(table.email)
}));

export const insertUserSchema = createInsertSchema(userTable);
export const selectUserSchema = createSelectSchema(userTable);
export const selectUserPublicInfoSchema = selectUserSchema.omit({password : true});

export const userTableRelations = relations(userTable, ({many}) => ({
    answered_questions : many(userAnswersTable)
}));