// const express = require('express');
// const methodOverride = require('method-override');
// const sessionMiddleware = require('./config/session');
// const logger = require('./utils/logger');
// require('./config/database'); 

// const app = express();

// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
// app.use(express.static('public'));

// app.use(sessionMiddleware);

// app.use((req, res, next) => {
//   res.locals.user = req.session.user;
//   next();
// });

// app.use('/', require('./routes/index'));

// app.use((err,req,res,next)=>{
//   logger.error(err.message);
//   res.status(500).send('Integernal server Error');
// });

// module.exports = app;

import express, {Request, Response, NextFunction } from 'express';
import methodOverride from 'method-override';
import sessionMiddleware from './config/session';
import passport from './config/passport';
import logger from './utils/logger';
import './config/database';
import authRoutes from './routes/authRoutes';

const app = express();

app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(sessionMiddleware);


app.use(passport.initialize());
app.use(passport.session());

app.use((req:Request, res:Response, next: NextFunction)=>{
  res.locals.user = req.session.user;
  next();
});
console.log('------------------------------------------------------asdfasdfasdfasdf');
app.use(authRoutes);
app.use('/',require('./routes/index'));

app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{
  logger.error(err.message);
  res.status(500).send('Internal Server Error');
});

export default app;
