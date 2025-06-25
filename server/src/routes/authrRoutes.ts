// server/src/routes/authRoutes.ts
import { Router } from 'express';
import { handleLogin } from '../controllers/authcontroller';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

// Login is open to everyone
router.post('/login', handleLogin);

//STUDENT REGISTRATION ROUTE

//STAFF REGISTRATION ROUTE

export default router;