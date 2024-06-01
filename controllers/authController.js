const crypto = require('crypto');
const User = require('../models/User');
const transporter = require('../config/mailer');
const generateUserId = require('../utils/generateUserId');
const logger = require('../utils/logger');


//Render Register form
exports.renderRegister = (req, res) => {
    res.render('register');
};

//Register user
exports.register = async (req, res) => {
    const { email, password, firstname, middlename, lastname, dob, address, city, state, country, pincode, phonenumber } = req.body;
    try {
        const userid = await generateUserId();
        const user = new User({userid,email, password, firstname, middlename, lastname, dob, address, city, state, country, pincode, phonenumber });
        await user.save(); 
        logger.info(`User registered with email : ${email}`);
        res.redirect('/login');  
    } catch (err) {
        logger.error(`Error registering user: ${err.message}`);
        res.render('register', { error: err.message });  
    }
};

//Render Login form
exports.renderLogin = (req, res) => {
    res.render('login');
};

//Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });  
    // console.log(user);
    if (user && (await user.comparePassword(password))) {  
        req.session.user = user;  
        logger.info(`User logged in with email : ${email}`);
        res.redirect('/user/dashboard');  
    } else {
        logger.warn(`Failed login attempt for email : ${email}`);
        res.render('login', { error: 'Invalid email or password' });  
    }
};

//Render forgot password form
exports.renderForgotPassword = (req,res)=>{
    res.render('forgot-password');
};

//Forgot password
exports.forgotPassword = async (req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        // console.log(user);
        if(!User){
            logger.warn(`Password reset requested for non-existent email: ${email}`);
            return res.render('forgot-password', {error: 'No user with that email address'});
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        const resetUrl = `https://${req.headers.host}/reset-password/${token}`;

        const mailOptions = {
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
        res.render('forgot-password',{message: 'An email has been sent to' + user.email + 'with further instructions.'});

    } catch (err){
        logger.error(`Error sending password reset email: ${err.message}`);
        res.render('forgot-password',{error: 'error'});
    }
};

//Render reset password
exports.renderResetPassword = async (req,res) =>{
    try{
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now()}
        });
        if(!user) {
            logger.warn(`Invalid or expired password reset token: ${req.params.token}`);
            return res.render('reset-password',{error: 'Password reset token is invalid or has expired.'});
        }
        res.render('reset-password', {token: req.params.token});
    }catch (err){
        logger.error(`Error in password reset process: ${err.message}`);
        res.render('reset-password',{error: 'error'});
    }
};

//reset password
exports.resetPassword = async(req,res)=>{
    const { password} = req.body;
    try{
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        });

        if(!user) {
            logger.warn(`Invalid or expired password reset token: ${req.params.token}`);
            return res.render('reset-password',{error: 'Password reset token is invalid or has expired.'});
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        logger.info(`Password reset successfully for email: ${user.email}`);
        res.redirect('/login');
    } catch(err) {
        logger.error(`Error resetting password: ${err.message}`);
        res.render('reset-password', { error: 'error'});
    }
};

//logout
exports.logout =  (req, res) => {
    req.session.destroy(err => {
        if (err) {
            logger.error(`Error logging out: ${err.message}`);
            return res.redirect('/user/dashboard');  
        }
        res.clearCookie('connect.sid');  
        logger.info(`User logged out: ${req.session.user.email}`);
        res.redirect('/login'); 
    });
};