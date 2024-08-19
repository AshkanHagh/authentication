import { Hono } from 'hono';
import { validationMiddleware } from '../middlewares/validation';
import { magicLinkSchema, registerSchema } from '../types/zod';
import { login, register, verifyAccount } from '../controllers/auth.controller';
import { checkIpInfo } from '../middlewares/ipChecker';
import { some, every } from 'hono/combine';

const authRouter = new Hono()

authRouter.post('/register', validationMiddleware('json', registerSchema), register);

authRouter.get('/verify', validationMiddleware('query', magicLinkSchema), verifyAccount);

authRouter.post('/login', some(every(checkIpInfo, validationMiddleware('json', registerSchema))), login);

export default authRouter;