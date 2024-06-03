import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';
import { getChatHistory, sendMessage } from '../controllers/chatController';
import checkRole from '../middleware/role';
const router = Router();

  
router.get('/chats/history/:userId', isAuthenticated,checkRole(['admin','member']), getChatHistory);
router.post('/send', isAuthenticated,checkRole(['admin','member']), sendMessage);

export default router;
