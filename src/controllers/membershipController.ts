// src/controllers/membershipController.ts

import { Request, Response } from 'express';
import User from '../models/User';
import Razorpay from 'razorpay';
import Transaction from '../models/Transaction';
import { calculateMembershipEndDate } from '../utils/membership';
import logger from '../utils/logger';



// Initialize Razorpay client with your API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});


export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const purchaseMembership = async (req: Request, res: Response) => {
  try {
      const user = await User.findById(req.session.user?._id);
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Create Razorpay payment
      const order = await razorpay.orders.create({
          amount: process.env.AMT || 1000, // Example amount (in paise)
          currency: 'INR',
          receipt: `membership_receipt_${new Date().getTime()}`,
          payment_capture: true
      });

      // Save the order details to the database
      const transaction = new Transaction({
          userId: user._id,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          status: 'created'
      });
      await transaction.save();

      // Send the order ID to the client for payment processing
      res.json({ orderId: order.id });
  } catch (error: any) {
      logger.error(`Error purchasing membership: ${error.message}`);
      res.status(500).send('Server error');
  }
};

export const paymentSuccess = async (req: Request, res: Response) => {
  try {
      const { orderId, paymentId } = req.body;

      // Log the orderId for debugging
      console.log(`Received orderId: ${orderId}`);

      // Find the transaction by orderId
      const transaction = await Transaction.findOne({ orderId });
      console.log(`Transaction found: ${transaction}`);
      
      if (!transaction) {
          console.error(`Transaction not found for orderId: ${orderId}`);
          return res.status(404).send('Transaction not found');
      }

      // Wait for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update the transaction status and paymentId
      transaction.status = 'paid';
      transaction.paymentId = paymentId;
      await transaction.save();

      // Find the user associated with the transaction
      const user = await User.findById(transaction.userId);
      if (!user) {
          console.error(`User not found for userId: ${transaction.userId}`);
          return res.status(404).send('User not found');
      }

      // Update user membership details
      const currentDate = new Date();
      user.role = 'member';
      user.membershipStartDate = currentDate;
      user.membershipEndDate = addDays(currentDate, 30);
      await user.save();

      res.send('Payment successful and membership updated');
  } catch (error: any) {
      logger.error(`Error in payment success: ${error.message}`);
      res.status(500).send('Server error');
  }
};


export const renewMembership = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.session.user?._id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Create Razorpay payment
        const order = await razorpay.orders.create({
            amount: process.env.AMT||1000, // Example amount (in paise)
            currency: 'INR',
            receipt: 'membership_renewal_receipt_001',
            payment_capture: true
        });

        // Send the order ID to the client for payment processing
        res.json({ orderId: order.id });
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
