import { Hono } from 'hono';
import { createRole, existingRoles, giveUserRole, updateRole } from '../controllers/dashboard.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/authorization';
import { some, every } from 'hono/combine';
import { validationMiddleware } from '../middlewares/validation';
import { basicRoleSchema, giveUserRoleSchema, updateRoleSchema } from '../schemas';

const dashboardRouter = new Hono();

dashboardRouter.post('/role', some(every(isAuthenticated, authorizedRoles('admin'), 
    validationMiddleware('json', basicRoleSchema))
), createRole);

dashboardRouter.patch('/role', some(every(isAuthenticated, authorizedRoles('admin'), 
    validationMiddleware('json', updateRoleSchema))
), updateRole);

dashboardRouter.patch('/role/:userId', some(every(isAuthenticated, authorizedRoles('admin'), 
    validationMiddleware('json', giveUserRoleSchema))
), giveUserRole);

dashboardRouter.get('/roles', some(every(isAuthenticated, authorizedRoles('admin'))), existingRoles);

export default dashboardRouter;