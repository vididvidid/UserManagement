const express = require('express');
const methodOverride = require('method-override');
const sessionMiddleware = require('./config/session');
require('./config/database'); // Initialize the database connection

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(sessionMiddleware);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use('/', require('./routes/index'));

module.exports = app;
