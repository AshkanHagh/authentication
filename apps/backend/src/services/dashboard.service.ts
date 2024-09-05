import ErrorHandler from '../utils/errorHandler';
import { allPermissions, type AllPermissions } from '../types';
import { hget, hmdel, hmset } from '../database/cache';
import { dashboardEvent } from '../events';
import { updateUsersRole } from '../database/queries/dashboard.query';
import { updateAllCacheUsersRole } from '../database/cache/dashboard.cache';

export const createRoleService = async (name : string, permissions : AllPermissions[]) : Promise<string> => {
    try {
        const permissionMatches : boolean = permissions.some(role => !allPermissions.includes(role));
        if(permissionMatches) throw new ErrorHandler('Invalid permissions.');
        await hmset('role_permissions', name, permissions, 30 * 24 * 60 * 60 * 1000);
        dashboardEvent.emit('generate_roles_type', [name]);
        return 'Role and permission added';

    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(error.message, error.statusCode);
    }
}

export const updateRoleService = async (oldname : string, name : string, permissions : AllPermissions[]) => {
    try {
        const permissionMatches : boolean = permissions.some(permission => !allPermissions.includes(permission));
        if(permissionMatches) throw new ErrorHandler('Invalid permissions.');
        
        const oldRole : string = await hget('role_permissions', oldname, 30 * 24 * 60 * 60 * 1000);
        if(!oldRole) throw new ErrorHandler('Pervious role not found');

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