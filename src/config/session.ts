// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// require('dotenv').config();

// const mongoUri = process.env.MONGODB_URI;

// const sessionMiddleware = session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: mongoUri,
//   }),
// });

// module.exports = sessionMiddleware;


import session from 'express-session';
// import { MongoStore } from 'connect-mongo'; // Import MongoStore from connect-mongo
import MongoStore = require('connect-mongo');
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI as string;

const sessionMiddleware = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUri,
    // You might need to pass additional options here if required
  }),
});

export default sessionMiddleware;