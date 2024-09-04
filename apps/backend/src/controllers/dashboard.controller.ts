import type { Context } from 'hono';
import { CatchAsyncError } from '../utils';
import type { SetRoleResponse, SetRoleSchema } from '../schemas';
import { createRoleService } from '../services/dashboard.service';

export const createRole = CatchAsyncError(async (context : Context) => {
    const { name, permissions } = context.req.validationData.json as SetRoleSchema;
    const message : string = await createRoleService(name, permissions);
    return context.json({ success : true, message } as SetRoleResponse, 201);
});