// server/src/routes/publicRoutes.ts
import { Router } from 'express';
import { getCommitteeMembers } from '../controllers/userController';

const router = Router();

router.get('/committee', getCommitteeMembers);

export default router;