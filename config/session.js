const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

const sessionMiddleware = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUri,
  }),
});

module.exports = sessionMiddleware;
