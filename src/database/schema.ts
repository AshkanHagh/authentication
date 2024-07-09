import { pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const UserRole = pgEnum('role', ['user', 'admin', 'manager']);
export const UserTable = pgTable('users', {
    id : uuid('id').primaryKey().defaultRandom(),
    username : varchar('username', {length : 255}).notNull(),
    email : varchar('email', {length : 255}).notNull(),
    password : varchar('password', {length : 255}).notNull(),
    createdAt : timestamp('createdAt').defaultNow(),
    updatedAt : timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
}, table => {
    return {emailIndex : uniqueIndex('emailIndex').on(table.email), usernameIndex : uniqueIndex('usernameIndex').on(table.username)}
});