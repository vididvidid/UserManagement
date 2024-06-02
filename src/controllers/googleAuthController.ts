// src/controllers/googleAuthController.ts
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import  logger  from '../utils/logger';

// Middleware to log Google Auth initiation
const logGoogleAuth = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Initiating Google OAuth process');
  next();
};

export const googleAuth = [
  logGoogleAuth,
  passport.authenticate('google', { scope: ['profile', 'email'] })
];

export const googleAuthRedirect = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', (err: any, user: any, info: any) => {
    if (err) {
      logger.error(`Google OAuth Error: ${err.message}`);
      return res.redirect(`/login?error=${encodeURIComponent(err.message)}`);
    }
    if (!user) {
      logger.error('Google OAuth: No user found');
      return res.redirect(`/login?error=${encodeURIComponent(info?.message || 'Login failed')}`);
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        logger.error(`Login Error: ${loginErr.message}`);
        return res.redirect(`/login?error=${encodeURIComponent(loginErr.message)}`);
      }
      // Successful authentication, set user in session and redirect home.
      req.session.user = user;
      logger.info('Google OAuth: Successful authentication');
      res.redirect('/user/dashboard');
    });
  })(req, res, next);
};
