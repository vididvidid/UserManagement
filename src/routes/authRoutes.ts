
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


router.get('/',authController.renderHome);
router.get('/about',authController.renderAbout);
router.get('/gallery',authController.renderGallery);
router.get('/join',authController.renderJoin);
router.get('/donate',authController.renderDonate);
router.get('/contactUs',authController.renderContactUs);
router.get('/ourWork',authController.renderOurWork);
router.get('/privacy-policy',authController.renderPrivacyPolicy);
router.get('/terms-and-conditions',authController.renderTermsAndConditions);
export default router;
