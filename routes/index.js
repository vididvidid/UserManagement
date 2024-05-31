const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',async (req,res)=>{
    const { username, password } = req.body;
    try{
        const user=new User({username, password});
        await user.save();
        res.redirect('/login');
    } catch (err){
        res.render('register',{error: err.messgae});
    }
});

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login',async(req,res)=>{
    const{ username, password} = req.body;
    const user = await User.findOne({ username });
    if( user && (await user.comparePassword(password))){
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.render('login',{ error: 'Invalid username or password'});
    }
});


router.get('/dashboard',(req,res)=>{
    if(!req.session.user) return res.redirect('/login');
    res.render('dashboard');
});


router.get('/edit',(req,res)=>{
    if(!req.session.user) return res.redirect('/login');
    res.render('edit',{user:req.session.user});
});

router.put('/edit',async (req,res)=>{
    const{username, password} = req.body;
    try{
        const user = await User.findById(req.session.user._id);
        user.username= username;
        if(password) user.password = password;
        await user.save();
        req.session.user= user;
        res.redirect('/dashboard');
    } catch (err){
        res.render('edit',{user: req.session.user, error: err.message});
    }
});

router.delete('/delete',async(req,res)=>{
    await User.findByIdAndDelete(req.session.user._id);
    req.session.destroy();
    res.redirect('/register');
});

router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.redirect('/dasboard');
        }
        res.clearCookie('connect.sid');
        res.redirect(`/login`);
    });
});

module.exports= router;