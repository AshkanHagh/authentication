import type { Context } from 'hono';
import { CatchAsyncError } from '../utils';
import type { BasicResponse, BasicRoleSchema, UpdateRoleSchema } from '../schemas';
import { updateRoleService } from '../services/dashboard.service';
import { dashboardEvent } from '../events';
import { hmset } from '../database/cache';

// we need to send a event that has role name and permission
export const createRole = CatchAsyncError(async (context : Context) => {
    const { name, permissions } = context.req.validationData.json as BasicRoleSchema;
    await hmset('role_permissions', name, permissions, 30 * 24 * 60 * 60 * 1000);
    dashboardEvent.emit('generate_roles_type', [name]);
    return context.json({success : true, message : 'Role and permission added'} as BasicResponse, 201);
});

// we need to send a event that has role name and permission
export const updateRole = CatchAsyncError(async (context : Context) => {
    const { oldname, name, permissions } = context.req.validationData.json as UpdateRoleSchema;
    const message : string = await updateRoleService(oldname, name, permissions);
    return context.json({success : true, message} as BasicResponse, 201);
});

export const giveUserRole = CatchAsyncError(async (context : Context) => {
    // const { userId } = context.req.param() as {userId : string};
    // const { role } = context.req.validationData.query;
});

// 1. update user role and give him new permissions with socket
// 2. use socket io when you create a role send a event that the role has been created
// 3. when you update a role and permission send event for clients to know about new changes
// 4. after updating user role send a event that this user role has been changed