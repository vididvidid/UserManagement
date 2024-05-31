const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Counter = require('../models/Counter');

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
    const user = await User.findOne({ email });  // Find the user by email
    console.log(user);
    if (user && (await user.comparePassword(password))) {  // Check if the user exists and the password matches
        req.session.user = user;  // Store the user in the session
        res.redirect('/dashboard');  // Redirect to the dashboard after successful login
    } else {
        res.render('login', { error: 'Invalid email or password' });  // Render the login page with an error message if login fails
    }
});

// Dashboard route - renders the dashboard page
router.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');  // Redirect to the login page if the user is not logged in
    res.render('dashboard', { user: req.session.user });  // Render the dashboard with the user's data
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
        const user = await User.findById(req.session.user._id);  // Find the user by ID
        // Update the user's details
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
        if (password) user.password = password;  // Update the password if provided
        await user.save();  // Save the updated user to the database
        req.session.user = user;  // Update the user in the session
        res.redirect('/dashboard');  // Redirect to the dashboard after successful update
    } catch (err) {
        res.render('edit', { user: req.session.user, error: err.message });  // Render the edit profile page with an error message if something goes wrong
    }
});

// Delete account route - handles account deletion
router.delete('/delete', async (req, res) => {
    await User.findByIdAndDelete(req.session.user._id);  // Find and delete the user by ID
    req.session.destroy();  // Destroy the session
    res.redirect('/register');  // Redirect to the registration page after account deletion
});

// Logout route - handles user logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');  // Redirect to the dashboard if there is an error destroying the session
        }
        res.clearCookie('connect.sid');  // Clear the session cookie
        res.redirect('/login');  // Redirect to the login page after successful logout
    });
});

module.exports = router;
