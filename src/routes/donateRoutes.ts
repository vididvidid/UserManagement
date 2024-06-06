// src/routes/membershipRoutes.ts

import { Router } from 'express';
import { donateOrg,donateStatus,DonateRecord } from '../controllers/donateController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Route to purchase a membership
router.post('/donate', donateOrg);

router.post('/afterdonatestatus',donateStatus);

// Route to check membership status 
router.get('/record', isAuthenticated, DonateRecord);

export default router;
