import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';
import { getChatHistory, sendMessage } from '../controllers/chatController';

const router = Router();

  
router.get('/chats/history/:userId', isAuthenticated, getChatHistory);
router.post('/send', isAuthenticated, sendMessage);

export default router;
