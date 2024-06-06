
import { Request, Response } from 'express';
import User from '../models/User';
import Razorpay from 'razorpay';
import Donate from '../models/Donate';
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

export const donateOrg = async (req: Request, res: Response) => {
    try {
        // Check if the donation is anonymous
        console.log('hello i am here to donate');
        const { amount, anonymous, donorName, donorEmail, donorMessage } = req.body;
        // Ensure amount is provided and is a positive number
        if (!amount || amount <= 0) {
            return res.status(400).send('Invalid donation amount');
        }
        // Initialize userId variable
        let userId = null;
        
        // If not anonymous and user session exists, fetch the user details
        if (!anonymous && req.session.user) {
            const user = await User.findById(req.session.user._id);
            if (!user) {
                return res.status(404).send('User not found');
            }
            userId = user._id;
        }
        console.log('hello i am here to donate------');

        // Create Razorpay payment
        const order = await razorpay.orders.create({
            amount: amount *100, 
            currency: 'INR',
            receipt: `donation_receipt_${new Date().getTime()}`,
            payment_capture: true
        });

        // Save the order details to the database
        const donate = new Donate({
            userId: userId,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            status: 'created'
        });

        // Save additional donor information if not anonymous
        if (!anonymous) {
            donate.donorName = donorName;
            donate.donorEmail = donorEmail;
            donate.donorMessage = donorMessage;
        }

        await donate.save();

        // Send the order ID to the client for payment processing
        res.json({ orderId: order.id });
    } catch (error: any) {
        logger.error(`Error processing donation: ${error.message}`);
        res.status(500).send('Server error');
    }
};



export const donateStatus = async (req: Request, res: Response) => {
  try {
      const { orderId, paymentId } = req.body;

      // Log the orderId for debugging
      console.log(`Received orderId: ${orderId}`);

      // Find the donation by orderId
      const donate = await Donate.findOne({ orderId });
      console.log(`Donation found: ${donate}`);
      
      if (!donate) {
          console.error(`Donation not found for orderId: ${orderId}`);
          return res.status(404).send('Donation not found');
      }

      // Wait for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update the donation status and paymentId
      donate.status = 'paid';
      donate.paymentId = paymentId;
      await donate.save();

      res.send('Payment successful and donation status updated');
  } catch (error: any) {
      logger.error(`Error in payment success: ${error.message}`);
      res.status(500).send('Server error');
  }
};

export const DonateRecord = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.session.user?._id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const donations = await Donate.find({ userId: user._id });
        res.json(donations);
    } catch (error: any) {
        logger.error(`Error fetching donation records: ${error.message}`);
        res.status(500).send('Server error');
    }
};
