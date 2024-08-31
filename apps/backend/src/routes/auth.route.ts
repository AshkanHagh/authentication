import { Hono } from 'hono';
import { validationMiddleware } from '../middlewares/validation';
import { loginSchema, verifyMagicLinkToken, registerSchema, socialAuthSchema, emailCheckSchema } from '../schemas';
import { emailCheck, login, logout, refreshToken, register, socialAuth, verifyAccount } from '../controllers/auth.controller';
import { setIpAddressToContext } from '../middlewares/iphandler';
import { some, every } from 'hono/combine';
import { isAuthenticated } from '../middlewares/authorization';

const authRouter = new Hono()

authRouter.post('/register', validationMiddleware('json', registerSchema), register);

authRouter.post('/verify', some(every(setIpAddressToContext, validationMiddleware('json', verifyMagicLinkToken))), verifyAccount);

authRouter.get('/email-check', validationMiddleware('query', emailCheckSchema), emailCheck);

authRouter.post('/login', some(every(setIpAddressToContext, validationMiddleware('json', loginSchema))), login);

authRouter.post('/social', some(every(setIpAddressToContext, validationMiddleware('json', socialAuthSchema))), socialAuth)

authRouter.get('/logout', isAuthenticated, logout);

authRouter.get('/refresh', setIpAddressToContext, refreshToken);

export default authRouter;