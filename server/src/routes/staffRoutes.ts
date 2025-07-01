//server/src/routes/staffRoutes.ts
import { 
    createOrUpdateMyStaffProfile, 
    getMyStaffProfile,
    getStudentDetails, 
    createDisciplinaryAction, 
    updateDisciplinaryAction } 
    from "../controllers/userController";
import { Router } from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";
import upload from "../middleware/multerConfig";

const router = Router();

router.use(authenticateToken, authorizeRole(['WARDEN', 'CARETAKER']));

router.get('/profile', getMyStaffProfile);
router.post('/profile', upload.single('profilePhoto'), createOrUpdateMyStaffProfile);

// Route to get the detail of student
router.get('/:studentProfileId/details', getStudentDetails);

// Must be a Warden to create an action
router.post('/action', createDisciplinaryAction)

// Using PATCH is standard for partial updates of an existing resource
router.patch('/action/:actionId', updateDisciplinaryAction);

export default router;