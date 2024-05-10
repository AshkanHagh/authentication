import { Router } from 'express';
import { activateUser, login, logout, register, updateAccessToken } from '../controllers/user.controller';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth';

const router = Router();

router.post('/signup', register);

router.post('/active', activateUser);

router.post('/login', login);

router.get('/logout', isAuthenticated, logout);

router.get('/refresh', updateAccessToken);

export default router;