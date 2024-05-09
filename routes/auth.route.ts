import { Router } from 'express';
import { login, register, verify } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);

router.post('/verify', verify);

router.post('/login', login);

export default router;