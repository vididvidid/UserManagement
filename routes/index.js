const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Counter = require('../models/Counter');
const transporter = require('../config/mailer');
const crypto = require('crypto');

//Function to generate a new unique userid
const generateUserId = async()=>{
    try {
        const counter = await Counter.findByIdAndUpdate(
            {_id:'userid'},
            {$inc: {seq:1}},
            {new:true,upsert: true}
        );
        return `sdpmss${counter.seq}`;
    } catch (error) {
        throw new Error('Error generating user ID');
    }
};


// Register route - renders the registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// Register route - handles form submission
router.post('/register', async (req, res) => {
    const { email, password, firstname, middlename, lastname, dob, address, city, state, country, pincode, phonenumber } = req.body;
    try {
        const userid = await generateUserId();
        const user = new User({userid,email, password, firstname, middlename, lastname, dob, address, city, state, country, pincode, phonenumber });
        await user.save(); 
        res.redirect('/login');  
    } catch (err) {
        res.render('register', { error: err.message });  
    }
});

// Login route - renders the login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Login route - handles form submission
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });  
    console.log(user);
    if (user && (await user.comparePassword(password))) {  
        req.session.user = user;  
        res.redirect('/dashboard');  
    } else {
        res.render('login', { error: 'Invalid email or password' });  
    }
});

//Forgot password route - renders the forgot passward form
router.get('/forgot-password',(req,res)=>{
    res.render('forgot-password');
});

router.post('/forgot-password',async (req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        console.log(user);
        if(!User){
            return res.render('forgot-password', {error: 'No user with that email address'});
        }
        console.log("step-------1");
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
});

//Reset Password route - renders the reset password form
router.get('/reset-password/:token',async (req,res) =>{
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
});

//Reset password route - handles form submission
router.post('/reset-password/:token',async(req,res)=>{
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
});

// Dashboard route - renders the dashboard page
router.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');  
    res.render('dashboard', { user: req.session.user });  
});

// Edit profile route - renders the edit profile form
router.get('/edit', (req, res) => {
    if (!req.session.user) return res.redirect('/login');  
    const user = req.session.user;
    user.dob = new Date(user.dob);
    res.render('edit', { user }); 
});

// Edit profile route - handles form submission
router.put('/edit', async (req, res) => {
    const { email, password, firstname, middlename, lastname, dob, address, city, state, country, pincode, phonenumber } = req.body;
    try {
        const user = await User.findById(req.session.user._id);  
        user.email = email;
        user.firstname = firstname;
        user.middlename = middlename;
        user.lastname = lastname;
        user.dob = dob;
        user.address = address;
        user.city = city;
        user.state = state;
        user.country = country;
        user.pincode = pincode;
        user.phonenumber = phonenumber;
        if (password) user.password = password; 
        await user.save();  
        req.session.user = user;  
        res.redirect('/dashboard');  
    } catch (err) {
        res.render('edit', { user: req.session.user, error: err.message }); 
    }
});

// Delete account route - handles account deletion
router.delete('/delete', async (req, res) => {
    await User.findByIdAndDelete(req.session.user._id); 
    req.session.destroy();  
    res.redirect('/register');  
});

// Logout route - handles user logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');  
        }
        res.clearCookie('connect.sid');  
        res.redirect('/login'); 
    });
});

module.exports = router;
