// server/src/routes/userRoutes.ts
import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';
import { promoteStudent, demoteStudent, createStudentUser, createStaffUser, createDisciplinaryAction, getActionsForStudent, getAllStudents } from '../controllers/userController';

const router = Router();

//Apply middleware to the ENTIRE router.
//It ensures every request to /api/users/* must be from an authenticated WARDEN.
router.use(authenticateToken, authorizeRole(['WARDEN']));

//Route for promoting a student
router.post('/promote', promoteStudent);

//Route for demoting a student
router.post('/demote', demoteStudent);

//Route for creating a new student
router.post('/create-student', createStudentUser);

//Route for creating a new Staff
router.post('/create-staff', createStaffUser);

// Warden can view actions for any student
router.get('/student/:studentProfileId/actions', getActionsForStudent);

//Route to the list of students
router.get('/students', getAllStudents);

export default router;