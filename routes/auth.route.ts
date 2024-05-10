import { Router } from 'express';
import { activateUser, login, logout, register, updateAccessToken } from '../controllers/auth.controller';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth';

const router = Router();

router.post('/register', register);

router.post('/active', activateUser);

router.post('/login', login);

router.get('/logout', isAuthenticated, logout);

router.get('/refresh', updateAccessToken);

export default router;