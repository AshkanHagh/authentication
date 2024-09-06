import ErrorHandler from '../utils/errorHandler';
import { type InitialPermissions } from '../types';
import { hget, hmdel, hmset, updateAllCacheUsersRole } from '../database/cache';
import { dashboardEvent } from '../events';
import { updateUsersRole } from '../database/queries';

export const updateRoleService = async (oldname : string, name : string, permissions : InitialPermissions[]) => {
    try {
        const oldRole : string = await hget('role_permissions', oldname, 30 * 24 * 60 * 60 * 1000);
        if(!oldRole) throw new ErrorHandler('Pervious role not found', 400);

        await Promise.all([updateUsersRole(oldname, name), hmdel('role_permissions', oldname),
            hmset('role_permissions', name, permissions, 30 * 24 * 60 * 60 * 1000), await updateAllCacheUsersRole(oldname, name)
        ]);
        dashboardEvent.emit('generate_roles_type', [name]);
        return 'Role and permission has been updated';
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(error.message, error.statusCode);
    }
}