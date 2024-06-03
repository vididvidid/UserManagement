import express from 'express';
import {
    
    createMessage,
    getMessages,
    getMessageById,
    deleteMessageById,
} from '../controllers/contactController';

const router = express.Router();

// // Route to render the contact form
// router.get('/contact', renderContact);

// Route to create a new message
router.post('/contact', createMessage);

// Route to get all messages
router.get('/messages', getMessages);

// Route to get a message by ID
router.get('/messages/:id', getMessageById);

// Route to delete a message by ID
router.delete('/messages/:id', deleteMessageById);

export default router;
