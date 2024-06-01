const User = require('../models/User');

//Render Dashboard
exports.renderDashboard = (req, res) => {
    if (!req.session.user) return res.redirect('/login');  
    res.render('dashboard', { user: req.session.user });  
};

//Render edit profile
exports.renderEditProfile = (req, res) => {
    if (!req.session.user) return res.redirect('/login');  
    const user = req.session.user;
    user.dob = new Date(user.dob);
    res.render('edit', { user }); 
};

//edit profile
exports.editProfile = async (req, res) => {
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
        res.redirect('/user/dashboard');  
    } catch (err) {
        res.render('edit', { user: req.session.user, error: err.message }); 
    }
};

// delete accound
exports.deleteAccount = async (req, res) => {
    await User.findByIdAndDelete(req.session.user._id); 
    req.session.destroy();  
    res.redirect('/register');  
};