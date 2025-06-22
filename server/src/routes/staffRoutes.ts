//server/src/routes/staffRoutes.ts
import { createOrUpdateMyStaffProfile,getMyStaffProfile } from "../controllers/userController";
import { Router } from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";
import upload from "../middleware/multerConfig";

const router = Router();

router.use(authenticateToken, authorizeRole(['WARDEN', 'CARETAKER']));

router.get('/profile', getMyStaffProfile);
router.post('/profile', upload.single('profilePhoto'), createOrUpdateMyStaffProfile);

export default router;