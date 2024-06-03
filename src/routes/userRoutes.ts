import express from 'express';
import * as userController from '../controllers/userController';
import checkRole from '../middleware/role';
import { isAuthenticated } from '../middleware/auth';
import {checkMembership} from '../middleware/checkMembership';

const router = express.Router();

// Dashboard route
router.get('/dashboard', isAuthenticated, checkRole(['user','member']),checkMembership, userController.renderDashboard);

// Edit profile route
router.get('/edit-profile', isAuthenticated, checkRole(['user','member']),checkMembership, userController.renderEditProfile);
router.put('/edit-profile', isAuthenticated, checkRole(['user','member']),checkMembership, userController.editProfile);

// Delete account route
router.delete('/delete-account', isAuthenticated, checkRole(['user','member']),checkMembership, userController.deleteAccount);

// Scan user route
router.get('/scan', userController.renderScanPage);
router.post('/scan',  userController.scanUserById);

// Chat route
router.get('/chat',isAuthenticated,checkRole(['user','member']),checkMembership,userController.chatWithOwner);
// router.post('/chat', isAuthenticated, checkRole(['user','member']),checkMembership, userController.chatWithOwner);

router.get('/membership', isAuthenticated, checkRole(['user','member']),checkMembership, userController.renderMembershipPage);
export default router;
