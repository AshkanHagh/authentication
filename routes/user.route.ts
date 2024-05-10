import { Router } from 'express';
import { activateUser, login, logout, register } from '../controllers/user.controller';

const router = Router();

router.post('/signup', register);

router.post('/active', activateUser);

router.post('/login', login);

router.post('/logout', logout);

export default router;