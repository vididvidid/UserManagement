// src/routes/membershipRoutes.ts

import { Router } from 'express';
import { donateOrg,donateStatus,DonateRecord ,donateRedirect} from '../controllers/donateController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Route to purchase a membership
router.post('/donate', donateOrg);
router.get('/redirect_url/:merchantTransactionId', donateRedirect);
router.post('/afterdonatestatus',donateStatus);

// Route to check membership status 
router.get('/record', isAuthenticated, DonateRecord);

export default router;
