import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const userTable = sqliteTable('users', {
    id : text('id').primaryKey().$defaultFn(() => uuid()),
    name : text('name', {length : 255}).notNull(),
    email : text('email', {length : 255}).notNull().unique(),
    password : text('password'),
    image : text('image'),
    createdAt : text('created_At').default(sql`(current_timestamp)`),
    updatedAt : text('updated_at').default(sql`(current_timestamp)`).$onUpdate(() => sql<string>`(current_timestamp)`)
}, table => ({
    emailIndex : uniqueIndex('emailIndex').on(table.email)
}));

export const roleTable = sqliteTable('roles', {
    id : text('id').primaryKey().$defaultFn(() => uuid()),
    name : text('name', {length : 50}).notNull().unique()
});

export const userRoleTable = sqliteTable('user_roles', {
    userId : text('user_id').references(() => userTable.id),
    roleId : text('role_id').references(() => roleTable.id)
}, table => ({
    uniqueUserRole : uniqueIndex('uniqueUserRole').on(table.userId, table.roleId)
}));

export const rolePermissionTable = sqliteTable('role_permissions', {
    id : text('id').primaryKey().$defaultFn(() => uuid()),
    roleId : text('role_id').references(() => roleTable.id),
    permission : text('permission').notNull()
}, table => ({
    roleAndPermissionIndex : uniqueIndex('roleAndPermissionIndex').on(table.roleId, table.permission)
}));

export const userTableRelations = relations(userTable, ({many}) => ({
    roles : many(userRoleTable)
}));

export const roleTableRelations = relations(roleTable, ({many}) => ({
    users : many(userRoleTable),
    permissions : many(rolePermissionTable)
}));

export const userRoleTableRelations = relations(userRoleTable, ({one}) => ({
    user : one(userTable, {
        fields : [userRoleTable.userId],
        references : [userTable.id]
    }),
    role : one(roleTable, {
        fields : [userRoleTable.roleId],
        references : [roleTable.id]
    })
}));

export const rolePermissionTableRelations = relations(rolePermissionTable, ({one}) => ({
    role : one(roleTable, {
        fields : [rolePermissionTable.roleId],
        references : [roleTable.id]
    })
}));

export const selectUserSchema = createSelectSchema(userTable);
export const InsertUserSchema = createInsertSchema(userTable);
export const selectUserPublicInfoSchema = selectUserSchema.omit({password : true});

export const selectRolePermissionSchema = createSelectSchema(rolePermissionTable);
export const insertRolePermissionSchema = createInsertSchema(rolePermissionTable);