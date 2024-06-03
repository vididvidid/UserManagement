import { Request, Response } from 'express';
import ContactUs from '../models/Contact';

// // Render the contact form
// export const renderContact = (req: Request, res: Response) => {
//     res.render('contact');
// };

// Create a new message
export const createMessage = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        const newMessage = new ContactUs({
            name,
            email,
            message,
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create message' });
    }
};

// Get all messages
export const getMessages = async (req: Request, res: Response) => {
    try {
        const messages = await ContactUs.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get messages' });
    }
};

// Get message by ID
export const getMessageById = async (req: Request, res: Response) => {
    try {
        const messageId = req.params.id;
        const message = await ContactUs.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get message' });
    }
};

// Delete message by ID
export const deleteMessageById = async (req: Request, res: Response) => {
    try {
        const messageId = req.params.id;
        const deletedMessage = await ContactUs.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};
