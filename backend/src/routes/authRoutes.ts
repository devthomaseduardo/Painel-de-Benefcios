import { Router } from 'express';
import { login, register, googleLogin, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/register', register); // Em produção, isto deve ser protegido por admin
router.post('/google', googleLogin);
router.get('/profile', authenticate, getProfile);

export default router;
