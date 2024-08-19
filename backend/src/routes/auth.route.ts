import { Hono } from 'hono';
import { validationMiddleware } from '../middlewares/validation';
import { magicLinkSchema, registerSchema } from '../types/zod';
import { login, register, verifyAccount } from '../controllers/auth.controller';
import { checkIpInfo, handelIpRequest } from '../middlewares/ipChecker';
import { some, every } from 'hono/combine';

const authRouter = new Hono()

authRouter.post('/register', some(every(handelIpRequest, validationMiddleware('json', registerSchema))), register);

authRouter.get('/verify', some(every(handelIpRequest, validationMiddleware('query', magicLinkSchema))), verifyAccount);

authRouter.post('/login', some(every(checkIpInfo, validationMiddleware('json', registerSchema))), login);

export default authRouter;