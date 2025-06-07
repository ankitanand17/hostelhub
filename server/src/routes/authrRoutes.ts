// server/src/routes/authRoutes.ts
import { Router } from 'express';
import { handleLogin, handleStaffRegistration, handleStudentRegistration } from '../controllers/authcontroller';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

// Login is open to everyone
router.post('/login', handleLogin);

//STUDENT REGISTRATION ROUTE
router.post(
    '/register/student', 
    authenticateToken, 
    authorizeRole(['WARDEN', 'HOSTEL_ADMIN']), 
    handleStudentRegistration
);

//STAFF REGISTRATION ROUTE
router.post(
    '/register/staff', 
    authenticateToken, 
    authorizeRole(['WARDEN']), 
    handleStaffRegistration
);

export default router;