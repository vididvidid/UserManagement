// src/jobs/membershipJob.ts

import cron from 'node-cron';
import User from '../models/User';

const updateMembershipStatus = async () => {
  const now = new Date();
  await User.updateMany(
    { membershipEndDate: { $lt: now }, role: 'member' },
    { $set: { role: 'user' } }
  );
};

cron.schedule('0 0 * * *', updateMembershipStatus); // Runs every day at midnight

export default updateMembershipStatus;
