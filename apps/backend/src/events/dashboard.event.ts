import { EventEmitter } from 'node:events';
import { allPermissions } from '../types';
import ErrorHandler from '../utils/errorHandler';
import fs from 'fs/promises';
import path from 'path';
import { hget, hgetall, hmset } from '../database/cache';

export const dashboardEvent = new EventEmitter();

dashboardEvent.on('insertAdminRoleAndPermission', async () => {
    const isAdminRolePermissionExists = await hget('role_permissions', 'admin', 30 * 24 * 60 * 60 * 1000);
    if(!isAdminRolePermissionExists) await hmset('role_permissions', 'admin', allPermissions, 30 * 24 * 60 * 60 * 1000)
});

dashboardEvent.on('insertBasicRoleAndPermission', async () => {
    const isAdminRolePermissionExists : string = await hget('role_permissions', 'basic', 30 * 24 * 60 * 60 * 1000);
    if(!isAdminRolePermissionExists) await hmset('role_permissions', 'basic', [], 30 * 24 * 60 * 60 * 1000)
});

dashboardEvent.on('emitRoleInsert', async () => {
    dashboardEvent.emit('insertAdminRoleAndPermission')
    dashboardEvent.emit('insertBasicRoleAndPermission')
});

export const generateRolesType = async (rolesDetail : string[]) : Promise<void> => {
    const typeDefinition : string = `export type Roles = ${rolesDetail.map(role => `'${role}'`).join(' | ')}`;
    const filePath : string = path.join(__dirname, '../types/roles.ts');

    await fs.mkdir(path.dirname(filePath), { recursive : true });
    await fs.writeFile(filePath, typeDefinition);
}

dashboardEvent.on('generate_roles_type', async (roleName? : string) => {
    try {
        const rolesCache : Record<string, string> = await hgetall('role_permissions', 30 * 24 * 60 * 60 * 1000);
        const roles : string[] = Object.keys(rolesCache);

        const combinedNewAndOldRoles : string[] = roleName ? roles.some(role => role === roleName) ? roles : [...roles, roleName] : roles;
        await generateRolesType(combinedNewAndOldRoles);
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode)
    }
});