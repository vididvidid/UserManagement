// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');


// const UserSchema = new mongoose.Schema({
//   userid:{type:String,unique:true,required:true},
//   email:{type:String,required:true,unique:true},
//   password:{type:String,required:true},
//   firstname:{type:String,required:true},
//   middlename:{type:String},
//   lastname:{type:String,required:true},
//   dob:{type:Date,required:true},
//   address:{type:String,required:true},
//   city:{type:String,required:true},
//   state:{type:String,required:true},
//   country:{type:String,required:true},
//   pincode:{type:String,required:true},
//   phonenumber:{type:String,required:true},
//   resetPasswordToken:String,
//   resetPasswordExpires:Date,
// });

// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// UserSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);


import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  userid: string;
  email: string;
  password: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  dob: Date;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phonenumber: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  userid: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  middlename: { type: String },
  lastname: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  phonenumber: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

