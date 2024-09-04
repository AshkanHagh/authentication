import ErrorHandler from '../utils/errorHandler';
import { allPermissions } from '../types';
import { hmset } from '../database/cache';
import { dashboardEvent } from '../events';

export const createRoleService = async (name : string, permissionsDetail : string[]) : Promise<string> => {
    try {
        const permissionsSet : string[] = Array.from(new Set(permissionsDetail));
        if(permissionsSet.some(role => !allPermissions.includes(role))) throw new ErrorHandler('Invalid permissions.');

        await hmset('role_permissions', name, permissionsSet, 30 * 24 * 60 * 60 * 1000);
        dashboardEvent.emit('generate_roles_type', name);
        return 'Role and permission add successfully';

    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(error.message, error.statusCode);
    }
}