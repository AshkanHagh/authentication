import { Hono } from 'hono';
import { updateProfile } from '../controllers/dashboard.controller';
import { isAuthenticated } from '../middlewares/auth';
import { some, every } from 'hono/combine';
import { handelIpRequest } from '../middlewares/ipChecker';
import { validationMiddleware } from '../middlewares/validation';
import { updateProfileSchema } from '../schemas';

const dashboardRouter = new Hono();

dashboardRouter.patch('/profile', some(every(handelIpRequest, isAuthenticated, validationMiddleware('parseBody', updateProfileSchema))),
    updateProfile
);

export default dashboardRouter;