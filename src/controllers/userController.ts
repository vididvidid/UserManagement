// const User = require('../models/User');
// const logger = require('../utils/logger');

// //Render Dashboard
// exports.renderDashboard = (req, res) => {
//     if (!req.session.user) return res.redirect('/login');  
//     res.render('dashboard', { user: req.session.user });  
// };

// //Render edit profile
// exports.renderEditProfile = (req, res) => {
//     if (!req.session.user) return res.redirect('/login');  
//     const user = req.session.user;
//     user.dob = new Date(user.dob);
//     res.render('edit', { user }); 
// };

// //edit profile
// exports.editProfile = async (req, res) => {
//     const { email, password, firstname, middlename, lastname, dob, address, city, state, country, pincode, phonenumber } = req.body;
//     try {
//         const user = await User.findById(req.session.user._id);  
//         user.email = email;
//         user.firstname = firstname;
//         user.middlename = middlename;
//         user.lastname = lastname;
//         user.dob = dob;
//         user.address = address;
//         user.city = city;
//         user.state = state;
//         user.country = country;
//         user.pincode = pincode;
//         user.phonenumber = phonenumber;
//         if (password) user.password = password; 
//         await user.save();  
//         req.session.user = user;  
//         logger.info(`User profile updated: ${user.email}`);
//         res.redirect('/user/dashboard');  
//     } catch (err) {
//         logger.error(`Error updating profile for user ${req.session.user.email}: ${err.message}`);
//         res.render('edit', { user: req.session.user, error: err.message }); 
//     }
// };

// // delete accound
// exports.deleteAccount = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.session.user._id); 
//         req.session.destroy();  
//         logger.info(`User account deleted: ${user.email}`);
//         res.redirect('/register');  
//     } catch (error) {
//         logger.error(`Error deleting account for user ${req.session.user.email}:${err.message}`);
//         res.redirect('/dashboard');        
//     }
// };

import { Request, Response } from 'express';
import User from '../models/User';
import logger from '../utils/logger';

// Render Dashboard
export const renderDashboard = (req: Request, res: Response) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('dashboard', { user: req.session.user });
};

// Render edit profile
export const renderEditProfile = (req: Request, res: Response) => {
  if (!req.session.user) return res.redirect('/login');
  const user = req.session.user;
  user.dob = new Date(user.dob);
  res.render('edit', { user });
};

// Edit profile
export const editProfile = async (req: Request, res: Response) => {
  const { email, password, firstname, middlename, lastname, dob, address, city, state, country, pincode, phonenumber } = req.body;
  try {
    const user = await User.findById(req.session.user?._id);
    if (user) {
      user.email = email;
      user.firstname = firstname;
      user.middlename = middlename;
      user.lastname = lastname;
      user.dob = dob;
      user.address = address;
      user.city = city;
      user.state = state;
      user.country = country;
      user.pincode = pincode;
      user.phonenumber = phonenumber;
      if (password) user.password = password;
      await user.save();
      req.session.user = user;
      logger.info(`User profile updated: ${user.email}`);
      res.redirect('/user/dashboard');
    }
  } catch (err: any) {
    logger.error(`Error updating profile for user ${req.session.user?.email}: ${err.message}`);
    res.render('edit', { user: req.session.user, error: err.message });
  }
};

// Delete account
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.session.user?._id);
    if (user) {
      req.session.destroy(() => {
        logger.info(`User account deleted: ${user.email}`);
        res.redirect('/register');
      });
    }
  } catch (err: any) {
    logger.error(`Error deleting account for user ${req.session.user?.email}: ${err.message}`);
    res.redirect('/dashboard');
  }
};
