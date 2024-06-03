import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import checkRole from '../middleware/role';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/dashboard', isAuthenticated, checkRole(['admin']), adminController.getAdminDashboard);
router.get('/users', isAuthenticated, checkRole(['admin']), adminController.getUsers);
router.get('/users/:id', isAuthenticated, checkRole(['admin']), adminController.getUser);
router.post('/users/:id', isAuthenticated, checkRole(['admin']), adminController.updateUser);
router.post('/users/:id/delete', isAuthenticated, checkRole(['admin']), adminController.deleteUser);
router.get('/profile', isAuthenticated, checkRole(['admin']), adminController.getAdminProfile);
router.post('/profile', isAuthenticated, checkRole(['admin']), adminController.updateAdminProfile);
router.post('/profile/delete', isAuthenticated, checkRole(['admin']), adminController.deleteAdminAccount);
router.get('/scan', isAuthenticated, checkRole(['admin']), adminController.getScanPage);
router.post('/scan', isAuthenticated, checkRole(['admin']), adminController.scanUser);
router.get('/chatUser', isAuthenticated, checkRole(['admin']), adminController.getChat);
router.get('/contactus',isAuthenticated,checkRole(['admin']), adminController.getContactUs);

export default router;
