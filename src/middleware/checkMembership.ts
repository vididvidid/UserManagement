// src/middleware/checkMembership.ts

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const checkMembership = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user._id);
    if (user && user.membershipEndDate && user.membershipEndDate < new Date()) {
      user.role = 'user';
      await user.save();
      req.session.user = user;
    }
  }
  next();
};
