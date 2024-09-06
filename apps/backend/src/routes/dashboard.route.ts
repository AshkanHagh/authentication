import { Hono } from 'hono';
import { createRole, updateRole } from '../controllers/dashboard.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/authorization';
import { some, every } from 'hono/combine';
import { setIpAddressToContext } from '../middlewares/iphandler';
import { validationMiddleware } from '../middlewares/validation';
import { basicRoleSchema, updateRoleSchema } from '../schemas';

const dashboardRouter = new Hono();

dashboardRouter.post('/role', some(every(setIpAddressToContext, isAuthenticated, authorizedRoles('admin'), 
    validationMiddleware('json', basicRoleSchema))
), createRole);

dashboardRouter.patch('/role', some(every(setIpAddressToContext, isAuthenticated, authorizedRoles('admin'), 
    validationMiddleware('json', updateRoleSchema))
), updateRole);

export default dashboardRouter;