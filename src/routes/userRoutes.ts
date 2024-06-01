// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const {isAuthenticated} = require('../middleware/auth');




// // Dashboard route 
// router.get('/dashboard', isAuthenticated, userController.renderDashboard);

// // Edit profile route 
// router.get('/edit',isAuthenticated, userController.renderEditProfile);
// router.put('/edit',isAuthenticated, userController.editProfile);

// // Delete account route
// router.delete('/delete',isAuthenticated, userController.deleteAccount);

// module.exports = router;


import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController';

import { isAuthenticated } from '../middleware/auth';

// Dashboard route
router.get('/dashboard', isAuthenticated, userController.renderDashboard);

// Edit profile route
router.get('/edit', isAuthenticated, userController.renderEditProfile);
router.put('/edit', isAuthenticated, userController.editProfile);

// Delete account route
router.delete('/delete', isAuthenticated, userController.deleteAccount);

export default router;
