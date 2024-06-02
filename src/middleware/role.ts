import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.user?._id; 

    if (!userId) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    try {
      const user = await User.findById(userId);
      if (user && roles.includes(user.role)) {
        return next();
      } else {
        return res.status(403).json({ message: 'Access Denied' });
      }
    } catch (err: any) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

export default checkRole;
