import { Request, Response } from 'express';
import User from '../models/User';
import logger from '../utils/logger';

// Render Dashboard
export const renderDashboard = (req: Request, res: Response) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/user-dashboard', { user: req.session.user });
};


// Render edit profile
export const renderEditProfile = (req: Request, res: Response) => {
  if (!req.session.user) return res.redirect('/login');
  const user = req.session.user;
  user.dob = new Date(user.dob);
  res.render('user/edit-profile', { user });
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
    res.render('user/edit-profile', { user: req.session.user, error: err.message });
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
    res.redirect('/user/dashboard');
  }
};

// Render scan page
export const renderScanPage = (req: Request, res: Response) => {
  res.render('user/scan-user');
};

// Scan user by ID
export const scanUserById = async (req: Request, res: Response) => {
  const { userid } = req.body;
  try {
    const user = await User.findOne({ userid });
    res.render('user/scan-user', { user });
  } catch (err) {
    res.render('user/scan-user', { error: 'User not found' });
  }
};

// Chat with owner
export const chatWithOwner = async (req: Request, res: Response) => {
  res.render('user/chat', { user: req.session.user });
};

// Render Membership page
export const renderMembershipPage = (req: Request, res: Response) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('user/purchase-membership', { user: req.session.user });
};