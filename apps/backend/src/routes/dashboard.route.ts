import { Hono } from 'hono';
import { createRole } from '../controllers/dashboard.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/authorization';
import { some, every } from 'hono/combine';
import { setIpAddressToContext } from '../middlewares/iphandler';
import { validationMiddleware } from '../middlewares/validation';
import { setRoleSchema } from '../schemas';

const dashboardRouter = new Hono();;

dashboardRouter.post('/role', some(every(setIpAddressToContext, isAuthenticated, authorizedRoles('basic'), 
    validationMiddleware('json', setRoleSchema))
), createRole);

export default dashboardRouter;