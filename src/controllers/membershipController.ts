// src/controllers/membershipController.ts

import { Request, Response } from 'express';
import User from '../models/User';
import  {calculateMembershipEndDate } from '../utils/membership';
import logger from '../utils/logger';

export const purchaseMembership = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.session.user?._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Here you would normally handle the payment process

    // Simulating a successful payment
    const paymentSuccessful = true;

    if (paymentSuccessful) {
      user.role = 'member';
      user.membershipStartDate = new Date();
      user.membershipEndDate = calculateMembershipEndDate(user.membershipStartDate);
      await user.save();
      req.session.user = user;
      res.status(200).send('Membership purchased successfully');
    } else {
      res.status(400).send('Payment failed');
    }
  } catch (error: any) {
    logger.error(`Error purchasing membership: ${error.message}`);
    res.status(500).send('Server error');
  }
};

export const renewMembership = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.session.user?._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Here you would normally handle the payment process

    // Simulating a successful payment
    const paymentSuccessful = true;

    if (paymentSuccessful) {
      user.membershipEndDate = calculateMembershipEndDate(new Date());
      await user.save();
      req.session.user = user;
      res.status(200).send('Membership renewed successfully');
    } else {
      res.status(400).send('Payment failed');
    }
  } catch (error: any) {
    logger.error(`Error renewing membership: ${error.message}`);
    res.status(500).send('Server error');
  }
};

export const checkMembershipStatus = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.session.user?._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.membershipEndDate && user.membershipEndDate < new Date()) {
      user.role = 'user';
      await user.save();
      req.session.user = user;
    }

    res.status(200).json({
      role: user.role,
      membershipEndDate: user.membershipEndDate,
    });
  } catch (error: any) {
    logger.error(`Error checking membership status: ${error.message}`);
    res.status(500).send('Server error');
  }
};