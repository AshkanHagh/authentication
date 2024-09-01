import { Hono } from 'hono';
import { updateProfile } from '../controllers/dashboard.controller';
import { isAuthenticated } from '../middlewares/authorization';
import { some, every } from 'hono/combine';
import { setIpAddressToContext } from '../middlewares/iphandler';
import { validationMiddleware } from '../middlewares/validation';
import { updateProfileSchema } from '../schemas';

const dashboardRouter = new Hono();

dashboardRouter.patch('/profile', some(every(setIpAddressToContext, isAuthenticated, 
    validationMiddleware('parseBody', updateProfileSchema))), updateProfile
);

export default dashboardRouter;