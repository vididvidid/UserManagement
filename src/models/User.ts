import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  userid: string;
  email: string;
  password?: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  dob?: Date;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  phonenumber?: string;
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  userid: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firstname: { type: String, required: true },
  middlename: { type: String },
  lastname: { type: String, required: true },
  dob: { type: Date },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  phonenumber: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
