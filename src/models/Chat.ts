import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  sender: string;
  receiver: string;
  message: string;
  timestamp: Date;
  readByAdmin: Boolean;
  readByUser: Boolean;
}

const ChatSchema: Schema<IChat> = new Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  readByAdmin: { type: Boolean, default: false },
  readByUser: { type: Boolean, default: false }
});

export default mongoose.model<IChat>('Chat', ChatSchema);
