import ErrorHandler from '../utils/errorHandler';
import { type InitialPermissions, type SelectUser } from '../types';
import { findRoleCache, hget, hmdel, hmset, hset, scanUsersCache, updateAllCacheUsersRole } from '../database/cache';
import { selectUsers, updateUserRole, updateUsersRole } from '../database/queries';
import type { GiveUserRoleSchema } from '../schemas';

export const updateRoleService = async (oldname : string, name : string, permissions : InitialPermissions[]) => {
    try {
        const oldRole : string = await hget('role_permissions', oldname);
        if(!oldRole) throw new ErrorHandler('Pervious role not found', 400);

        await Promise.all([updateUsersRole(oldname, name), updateAllCacheUsersRole(oldname, name), 
            hmdel('role_permissions', oldname), hmset('role_permissions', name, permissions, 30 * 24 * 60 * 60 * 1000)
        ]);
        return 'Role and permission has been updated';
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(error.message, error.statusCode);
    }
}

export const giveUserRoleService = async (userId : string, roleUpdates : GiveUserRoleSchema) => {
    try {
        const roleExists : string[] = await findRoleCache(roleUpdates.roles.map(update => update.oldRole))
        if(!roleExists[0]) throw new ErrorHandler('Role dose not exists', 400);

        const userEmail : string = await hget(`user:${userId}`, 'email');
        const updatedRoles : Pick<SelectUser, 'role'> = await updateUserRole(userId, roleUpdates);
        await Promise.all([hset(`user:${userId}`, updatedRoles, 604800), hset(`user:${userEmail}`, updatedRoles, 604800)]);
        return 'User role updated successfully';
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(error.message, error.statusCode);
    }
}