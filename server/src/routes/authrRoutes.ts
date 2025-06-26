// server/src/routes/authRoutes.ts
import { Router } from 'express';
import { handleLogin } from '../controllers/authcontroller';

const router = Router();

// Login is open to everyone
router.post('/login', handleLogin);

export default router;