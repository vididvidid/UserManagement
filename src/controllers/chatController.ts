import { Request, Response } from 'express';
import Chat from '../models/Chat';
import User from '../models/User';
import logger from '../utils/logger';

// export const renderChat= (req:Request, res:Response) => {
//     res.render('chat');
//   };

export const getChatHistory = async (req: Request, res: Response) => {
    const userId = req.params.userId;  // Get the user ID from the request parameters
    try {
      const chats = await Chat.find({
        $or: [
          { sender: userId, receiver: 'admin' },
          { sender: 'admin', receiver: userId }
        ]
      }).sort({ timestamp: 1 });
  
      res.json(chats);
    } catch (err: any) {
      logger.error(`Error fetching chat history: ${err.message}`);
      res.status(500).send('Internal Server Error');
    }
  };

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const sender = req.session.user?._id;
    const receiver = 'admin'; // Always sending to admin
    console.log("----------------------------asdfasdfasdfas---------------------------");
    const chat = new Chat({
      sender,
      receiver,
      message
    });
    console.log("------------------------------below the message---------------------------");
    await chat.save();
    console.log("------------------------------sdavesdfsd-----------------------------");
    res.status(201).json(chat);


  } catch (err: any) {
    res.status(500).send('Internal Server Error');
  }
};
