import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { userTable } from '../models/schema';

export type SelectUser = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;
export type PublicUserInfo = Omit<SelectUser, 'password'>;
export type SelectUserWithPermission = Omit<SelectUser, 'password'> & {permissions : string[]};

export type ActivationLink = {
    activationToken : string; magicLink : string
};
export type ActivationCode = {
    activationToken : string; activationCode : string
};

export type VerifyActivationCodeToken = {
    activationCode : string; user : Pick<SelectUser, 'email' | 'password'>;
}

export const initialPermissions = [
    'read-users', 'delete-users', 'changing-roles', 'analytics', 'read-admins', 'update-landing-page', 'support'
];
export const readonlyInitialPermissions = [
    'read-users', 'delete-users', 'changing-roles', 'analytics', 'read-admins', 'update-landing-page', 'support'
] as const;
export type InitialPermissions = typeof initialPermissions[number];