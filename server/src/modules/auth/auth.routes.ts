import express from 'express';
import { login, register, getProfile } from './auth.controller';
import { authenticate } from '../../utils/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getProfile);

export default router;















