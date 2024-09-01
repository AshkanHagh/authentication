import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { rolePermissionTable, roleTable, userRoleTable, userTable } from '../models/schema';

export type SelectUser = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;
export type PublicUserInfo = Omit<SelectUser, 'password'> & {roles : string[], permissions : string[]};

export type ActivationLink = {
    activationToken : string; magicLink : string
};
export type ActivationCode = {
    activationToken : string; activationCode : string
};

export type VerifyActivationCodeToken = {
    activationCode : string; user : Pick<SelectUser, 'email' | 'password'>;
}

export type SelectRole = InferSelectModel<typeof roleTable>;
export type InsertRole = InferInsertModel<typeof roleTable>;

export type SelectUserRole = InferSelectModel<typeof userRoleTable>;
export type InsertUserRole = InferInsertModel<typeof userRoleTable>;

export type SelectRolePermission = InferSelectModel<typeof rolePermissionTable>
export type InsertRolePermission = InferInsertModel<typeof rolePermissionTable>