import mongoose, { Document, Schema } from 'mongoose';

export interface IContactUs extends Document {
  name: string;
  email: string;
  message: string;
  timestamp: Date;
  responded: boolean;
}

const ContactUsSchema: Schema<IContactUs> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  responded: { type: Boolean, default: false }
});

export default mongoose.model<IContactUs>('ContactUs', ContactUsSchema);
