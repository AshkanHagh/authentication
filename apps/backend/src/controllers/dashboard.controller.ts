import type { Context } from 'hono';
import { CatchAsyncError } from '../utils';
import type { BasicResponse, BasicRoleSchema, GiveUserRoleSchema, RolesResponseSchema, UpdateRoleSchema } from '../schemas';
import { giveUserRoleService, updateRoleService } from '../services/dashboard.service';
import { hgetall, hmset } from '../database/cache';

export const createRole = CatchAsyncError(async (context : Context) => {
    const { name, permissions } = context.req.validationData.json as BasicRoleSchema;
    await hmset('role_permissions', name, permissions, 30 * 24 * 60 * 60 * 1000);
    return context.json({success : true, message : 'Role and permission added'} as BasicResponse, 201);
});

export const updateRole = CatchAsyncError(async (context : Context) => {
    const { oldname, name, permissions } = context.req.validationData.json as UpdateRoleSchema;
    const message : string = await updateRoleService(oldname, name, permissions);
    return context.json({success : true, message} as BasicResponse, 201);
});

export const giveUserRole = CatchAsyncError(async (context : Context) => {
    const { userId } = context.req.param() as {userId : string}
    const roleUpdates = context.req.validationData.json as GiveUserRoleSchema;
    
    const message = await giveUserRoleService(userId, roleUpdates);
    return context.json({success : true, message} as BasicResponse, 201);
});

export const existingRoles = CatchAsyncError(async (context : Context) => {
    const roles : string[] = Object.keys(await hgetall('role_permissions'));
    return context.json({success : true, roles} as RolesResponseSchema, 200);
});

// Next update tasks
// 1. Update the user role and grant him new permissions with the socket
// 2. When creating a role, use socket io, send an event that the role is created
// 3. When you update a role and permission, send an event to clients to notify them of the new changes
// 4. After updating the user role send an event that this user role has changed