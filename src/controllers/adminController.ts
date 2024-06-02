import { Request, Response } from 'express';
import User from '../models/User';
import logger from '../utils/logger';

export const getAdminDashboard = (req: Request, res: Response) => {
  res.render('admin-dashboard', { user: req.session.user });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.render('manage-users', { users });
  } catch (err:any) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('edit-user', { user });
  } catch (err:any) {
    logger.error(`Error fetching user: ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { firstname, middlename, lastname, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstname, middlename, lastname, email, role },
      { new: true }
    );
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.redirect('/admin/users');
  } catch (err:any) {
    logger.error(`Error updating user: ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.redirect('/admin/users');
  } catch (err:any) {
    logger.error(`Error deleting user: ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const getAdminProfile = (req: Request, res: Response) => {
  res.render('admin-profile', { user: req.session.user });
};

export const updateAdminProfile = async (req: Request, res: Response) => {
  try {
    const { firstname, middlename, lastname, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.session.user?._id,
      { firstname, middlename, lastname, email },
      { new: true }
    );
    if (!user) {
      return res.status(404).send('User not found');
    }
    req.session.user = user;
    res.redirect('/admin/profile');
  } catch (err:any) {
    logger.error(`Error updating profile: ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteAdminAccount = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.session.user?._id);
    req.session.destroy((err) => {
      if (err) {
        logger.error(`Error destroying session: ${err.message}`);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/login');
    });
  } catch (err:any) {
    logger.error(`Error deleting account: ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
};

export const getScanPage = (req: Request, res: Response) => {
  res.render('admin-scan', { user: null, error: null });
};

export const scanUser = async (req: Request, res: Response) => {
  const { userid } = req.body;
  try {
    const user = await User.findOne({ userid });
    if (!user) {
      return res.render('admin-scan', { user: null, error: 'User not found' });
    }
    res.render('admin-scan', { user, error: null });
  } catch (err) {
    res.render('admin-scan', { user: null, error: 'Error fetching user details' });
  }
};

export const getChat = async (req: Request, res: Response) => {
  try {
    const adminId = req.session.user?._id; // Get the current admin ID from the session
    const users = await User.find({ _id: { $ne: adminId } }); // Fetch all users excluding the current admin
    res.render('admin-chat', { admin: req.session.user, users });
  } catch (err: any) {
    logger.error(`Error fetching users for chat: ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
};