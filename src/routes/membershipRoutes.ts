// src/routes/membershipRoutes.ts

import { Router } from 'express';
import { paymentSuccess,purchaseMembership, renewMembership, checkMembershipStatus } from '../controllers/membershipController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Route to purchase a membership
router.post('/purchase', isAuthenticated, purchaseMembership);

router.post('/afterpaystatus',paymentSuccess);
// Route to renew a membership
router.post('/renew', isAuthenticated, renewMembership);

// Route to check membership status 
router.get('/status', isAuthenticated, checkMembershipStatus);

export default router;
