const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const User = require('./models/User');
const app = express();

const mongoUri = 'mongodb+srv://vididvidid:vididvidid@freecluster.jsszj6p.mongodb.net/';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(
    session({
        secret:'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoUri,
        }),
    })
);

app.use((req,res,next)=>{
    res.locals.user = req.session.user;
    next();
});

app.use('/',require('./routes/index'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));