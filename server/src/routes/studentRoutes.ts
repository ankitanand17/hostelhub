//server/src/routes/studentRoutes.ts
import { Router } from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";
import { getMyStudentProfile, createOrUpdateMyStudentProfile } from "../controllers/userController";
import upload from "../middleware/multerConfig";

const router = Router();

router.use(authenticateToken, authorizeRole(['STUDENT', 'HOSTEL_ADMIN', 'MESS_ADMIN']));

router.get('/profile', getMyStudentProfile);
router.post('/profile', upload.single('profilePhoto'),createOrUpdateMyStudentProfile);

export default router;