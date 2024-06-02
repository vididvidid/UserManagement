// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');


// // Register route - renders the registration form
// router.get('/register', authController.renderRegister);

// // Register route - handles form submission
// router.post('/register', authController.register);

// // Login route
// router.get('/login', authController.renderLogin);
// router.post('/login', authController.login);

// //Forgot password route 
// router.get('/forgot-password',authController.renderForgotPassword);
// router.post('/forgot-password',authController.forgotPassword);

// //Reset Password route 
// router.get('/reset-password/:token',authController.renderResetPassword);
// router.post('/reset-password/:token',authController.resetPassword);

// // Logout route 
// router.get('/logout',authController.logout);

// module.exports = router;

import express from 'express';
// import authController from '../controllers/authController';
import * as authController from '../controllers/authController';
import { googleAuth, googleAuthRedirect } from '../controllers/googleAuthController';
import passport from 'passport';

const router = express.Router();

// Register route - renders the registration form
router.get('/register', authController.renderRegister);

// Register route - handles form submission
router.post('/register', authController.register);

// Login route
router.get('/login', authController.renderLogin);
router.post('/login', authController.login);

// Forgot password route
router.get('/forgot-password', authController.renderForgotPassword);
router.post('/forgot-password', authController.forgotPassword);

// Reset Password route
router.get('/reset-password/:token', authController.renderResetPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Logout route
router.get('/logout', authController.logout);

router.get('/auth/google', googleAuth);
router.get('/auth/google/redirect', googleAuthRedirect);

export default router;
