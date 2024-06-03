import crypto from 'crypto';
import {Request, Response} from 'express';
import User from '../models/User';
import transporter from '../config/mailer';
import generateUserId from '../utils/generateUserId';
import logger from '../utils/logger';
// import generateRandomNumber from '../utils/generateRoomId';


//Render Register form

export const renderRegister = (req: Request, res: Response)=>{
    res.render('root/register');
};

//Register user

const isUnique = async (key: string, value: any) => {
  const user = await User.findOne({ [key]: value });
  return !user;
};

const generateUniqueUserId = async () => {
  let userid = await generateUserId();
  while (!(await isUnique('userid', userid))) {
    userid = await generateUserId();
  }
  return userid;
};

// const generateUniqueRoomId = async () => {
//   let roomid = await generateRandomNumber();
//   while (!(await isUnique('roomid', roomid))) {
//     roomid = await generateRandomNumber();
//   }
//   return roomid;
// };

export const register = async (req: Request, res: Response) => {
  const { email, password, firstname, middlename, lastname, dob, address, city, state, country, pincode, phonenumber, role, membershipStartDate, membershipEndDate } = req.body;
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If the email is already registered, return an error
      throw new Error('Email is already registered');
    }

    // If the email is unique, proceed with user registration
    const userid = await generateUniqueUserId();

    const user = new User({ userid,  email, password, firstname, middlename, lastname, dob, address, city, state, country, pincode, phonenumber, role, membershipStartDate, membershipEndDate });
    await user.save();
    logger.info(`User registered with email : ${email}`);
    res.redirect('/login');
  } catch (err: any) {
    logger.error(`Error registering user: ${err.message}`);
    res.render('root/register', { error: err.message });
  }
};


//Render Login form

export const renderLogin = (req: Request, res: Response)=>{
    res.render('root/login');
};

//Login user


// export const login = async (req: Request, res: Response)=>{
//     const {email, password} = req.body;
//     const user = await User.findOne({email});
//     if(user && (await user.comparePassword(password))){
//         req.session.user = user;
//         logger.info(`User logged in with email: ${email}`);
//         res.redirect('/user/dashboard');
//     } else {
//         logger.warn(`Failed login attempt for email : ${email}`);
//         res.render('login', {error: 'Invalid email or password'});
//     }
// };
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (user && (await user.comparePassword(password))) {
          req.session.user = user;
          logger.info(`User logged in with email: ${email}`);
          
          // Redirect based on user role
          if (user.role === 'admin') {
              res.redirect('/admin/dashboard');
          } 
          else {
              res.redirect('/user/dashboard');
          }
      } else {
          logger.warn(`Failed login attempt for email: ${email}`);
          res.render('root/login', { error: 'Invalid email or password' });
      }
  } catch (err: any) {
      logger.error(`Error during login for email ${email}: ${err.message}`);
      res.render('root/login', { error: 'Something went wrong, please try again later' });
  }
};

//Render forgot password form


export const renderForgotPassword = (req: Request, res: Response)=>{
    res.render('root/forgot-password');
};

//Forgot password

export const forgotPassword = async (req:Request, res:Response)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) {
            logger.warn(`Password reset requested for non-existent email: ${email}`);
            return res.render('root/forgot-password',{error: 'No user with that email address'});
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save( );
        const resetUrl = `http://${req.headers.host}/reset-password/${token}`;

        const mailOptions={
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to: ${email}`);
    res.render('root/forgot-password', {message: 'An email has been sent to '+ user.email+ ' with further instructions. '});
} catch (err:any){
    logger.error(`Error sending password reset email: ${err.message}`);
    res.render('root/forgot-password',{error: 'error'});
}
};


//Render reset password


export const renderResetPassword = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      if (!user) {
        logger.warn(`Invalid or expired password reset token: ${req.params.token}`);
        return res.render('reset-password', { error: 'Password reset token is invalid or has expired.' });
      }
      res.render('root/reset-password', { token: req.params.token });
    } catch (err: any) {
      logger.error(`Error in password reset process: ${err.message}`);
      res.render('root/reset-password', { error: 'error' });
    }
  };

//reset password
export const resetPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    try {
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        logger.warn(`Invalid or expired password reset token: ${req.params.token}`);
        return res.render('root/reset-password', { error: 'Password reset token is invalid or has expired.' });
      }
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
      logger.info(`Password reset successfully for email: ${user.email}`);
      res.redirect('/login');
    } catch (err: any) {
      logger.error(`Error resetting password: ${err.message}`);
      res.render('root/reset-password', { error: 'error' });
    }
  };


//logout

export const logout = (req: Request, res: Response) => {
    req.session.destroy(err => {
      if (err) {
        logger.error(`Error logging out: ${err.message}`);
        return res.redirect('/user/dashboard');
      }
      res.clearCookie('connect.sid');
      logger.info(`User logged out: ${req.session.user?.email}`);
      res.redirect('/login');
    });
  };


export const renderHome = (req: Request, res: Response)=>{
    res.render('root/home', { user: req.session.user });
};
export const renderAbout = (req: Request, res: Response)=>{
  res.render('root/about', { user: req.session.user });
};
export const renderContactUs = (req: Request, res: Response)=>{
  res.render('root/contactUs', { user: req.session.user });
};
export const renderDonate = (req: Request, res: Response)=>{
  res.render('root/donate', { user: req.session.user });
};
export const renderGallery = (req: Request, res: Response)=>{
  res.render('root/gallery', { user: req.session.user });
};
export const renderOurWork = (req: Request, res: Response)=>{
  res.render('root/ourwork', { user: req.session.user });
};
export const renderJoin = (req: Request, res: Response)=>{
  res.render('root/join', { user: req.session.user });
};