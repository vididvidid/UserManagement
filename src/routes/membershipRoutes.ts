// src/routes/membershipRoutes.ts

import { Router } from 'express';
import { purchaseMembership, renewMembership, checkMembershipStatus } from '../controllers/membershipController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.post('/purchase', isAuthenticated, purchaseMembership);
router.post('/renew', isAuthenticated, renewMembership);
router.get('/status', isAuthenticated, checkMembershipStatus);

export default router;
