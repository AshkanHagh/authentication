import { Hono } from 'hono';
import { validationMiddleware } from '../middlewares/validation';
import { loginSchema, verifyMagicLinkToken, registerSchema, socialAuthSchema, emailCheckSchema } from '../schemas';
import { emailCheck, login, logout, refreshToken, register, socialAuth, verifyAccount } from '../controllers/auth.controller';
import { checkIpInfo, handelIpRequest } from '../middlewares/ipChecker';
import { some, every } from 'hono/combine';
import { isAuthenticated } from '../middlewares/auth';

const authRouter = new Hono()

authRouter.post('/register', some(every(handelIpRequest, validationMiddleware('json', registerSchema))), register);

authRouter.get('/verify', some(every(handelIpRequest, validationMiddleware('query', verifyMagicLinkToken))), verifyAccount);

authRouter.get('/email-check', validationMiddleware('query', emailCheckSchema), emailCheck);

authRouter.post('/login', some(every(checkIpInfo, validationMiddleware('json', loginSchema))), login);

authRouter.post('/social', some(every(handelIpRequest, validationMiddleware('json', socialAuthSchema))), socialAuth)

authRouter.get('/logout', isAuthenticated, logout);

authRouter.get('/refresh', handelIpRequest, refreshToken);

export default authRouter;