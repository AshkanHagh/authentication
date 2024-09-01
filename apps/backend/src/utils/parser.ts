import type { PublicUserInfo } from '../types';

export type RoleAndPermission = Pick<PublicUserInfo, 'roles' | 'permissions'>
export const parseRolesAndPermissions = (role : string, permission : string) : RoleAndPermission => {
    const splitRole : string[] = role.split(',');
    const splitPermission: string[] = permission ? permission.split(',') : [];

    return {roles : splitRole, permissions : splitPermission};
}

export const combineParsedRoleAndPermission = (emailSearchCache : PublicUserInfo) => {
    const { permissions : newPermission, roles : newRoles } : RoleAndPermission = parseRolesAndPermissions(
        emailSearchCache.roles.toString(), emailSearchCache.permissions.toString()
    );
    const { roles, permissions, ...rest } = emailSearchCache;
    return {...rest, roles : newRoles, permissions : newPermission} as PublicUserInfo;
}