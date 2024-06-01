const crypto = require('crypto');
const User = require('../models/User');
const transporter = require('../config/mailer');
const generateUserId = require('../utils/generateUserId');


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
        res.redirect('/login');  
    } catch (err) {
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
        res.redirect('/user/dashboard');  
    } else {
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
            return res.render('forgot-password', {error: 'No user with that email address'});
        }
        // console.log("step-------1");
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
        res.render('forgot-password',{message: 'An email has been sent to' + user.email + 'with further instructions.'});

    } catch (err){
        res.render('forgot-password',{error: err.message});
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
            return res.render('reset-password',{error: 'Password reset token is invalid or has expired.'});
        }
        res.render('reset-password', {token: req.params.token});
    }catch (err){
        res.render('reset-password',{error: err.message});
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
            return res.render('reset-password',{error: 'Password reset token is invalid or has expired.'});
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.redirect('/login');
    } catch(err) {
        res.render('reset-password', { error: err.message});
    }
};

//logout
exports.logout =  (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/user/dashboard');  
        }
        res.clearCookie('connect.sid');  
        res.redirect('/login'); 
    });
};