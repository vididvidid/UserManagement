const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
  userid:{type:String,unique:true,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  firstname:{type:String,required:true},
  middlename:{type:String},
  lastname:{type:String,required:true},
  dob:{type:Date,required:true},
  address:{type:String,required:true},
  city:{type:String,required:true},
  state:{type:String,required:true},
  country:{type:String,required:true},
  pincode:{type:String,required:true},
  phonenumber:{type:String,required:true},
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
