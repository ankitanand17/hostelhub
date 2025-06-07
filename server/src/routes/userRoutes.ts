// server/src/routes/userRoutes.ts
import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';
import { promoteStudent, demoteStudent } from '../controllers/userController';

const router = Router();

//Apply middleware to the ENTIRE router.
//It ensures every request to /api/users/* must be from an authenticated WARDEN.
router.use(authenticateToken, authorizeRole(['WARDEN']));

//Route for promoting a student
router.post('/promote', promoteStudent);

//Route for demoting a student
router.post('/demote', demoteStudent);

export default router;