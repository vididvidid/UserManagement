import express, {Request, Response, NextFunction } from 'express';
import methodOverride from 'method-override';
import sessionMiddleware from './config/session';
import passport from './config/passport';
import logger from './utils/logger';
import './config/database';

const app = express();

app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(sessionMiddleware);


app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use((req:Request, res:Response, next: NextFunction)=>{
  res.locals.user = req.session.user;
  next();
});
console.log('------------------------------------------------------asdfasdfasdfasdf');
// Use routes
app.use('/',require('./routes/index'));


// Catch-all route for handling undefined routes
app.use((req: Request, res: Response) => {
  // Redirect to your desired URL
  res.redirect('/');
});


app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{
  logger.error(err.message);
  res.status(500).send('Internal Server Error');
});

export default app;
