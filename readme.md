

in this we have used
    "nodemon": "^3.1.2"    ----> for development
    "bcryptjs": "^2.4.3",
    "connect-mongo": "^5.1.0",
    "ejs": "^3.1.10",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "method-override": "^3.0.0",
    "mongoose": "^8.4.1"


model only have username, password
routes-> register, login, edit, delete, logout

features -> contains session feature, encrypted password.


----------------------------------------------------------------

added more fileds to the model
added custom id field which needed extra model counter

------------------------------------------------------------------

used crypto for random no.
use nodemailer --> to send email --> by using gmail --> settings-> app password --> generate
forgot password and reset password option created.
https://medium.com/@y.mehnati_49486/how-to-send-an-email-from-your-gmail-account-with-nodemailer-837bf09a7628


--------------------------------------------------------------------

dotenv for .env files

PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@freecluster.jsszj6p.mongodb.net/
EMAIL_USER=from@gmail.com
EMAIL_PASS=*****(from appPassword setting in settings.accoung.google.com )

--------------------------------------------------------------------

refactored the whole code 
routes( index, authRoutes, userRoutes)
controllers (userController, authController)
middleware( auth)
config (database,mailer,session)
app.js server.js

-------------------------------------------------------------------
used winston to add the logging services.

reduced the console logs. 

-------------------------------------------------------------------
converted to typescript 
-------------------------------------------------------------------
publiced by localhost.
npm install -g localtunnel
npm run build
npm start
lt --port 3000

password is your ip address
---------------------------------------------------------------------

google sso integrated


npm install passport passport-google-oauth20
npm install @types/passport @types/passport-google-oauth20

created passport.js for google oauth setup --> than created the routes and added logger service to it

NOTE: uri you will use should be fixed if it is changing than it will create trouble. i am using localtunnel -> everytime you restart --> you will get new url

so in this case you can use 
lt --port 3000 --subdomain mycustomsubdomain 


this can give you atleast 3-4 restart the same uri. 

also to make things run concurrently not in different terminals use 

npm install concurrently.

-------------------------------------------------------------------------
member/user/admin role based system added 
automatic membership management. using node-cron. 
---------------------------------------------------------------------------
used websoket to create chat one to one here admin to member only but its 
insecure since any one can play with the frontend and get all the messgae.

--------------------------------------------------------------------------

added the contactUs, all webpages, and google translate api

-----------------------------------------------------------------------



work need to do
http --> https
payment gateway
donate ammount (custom money option)
receipt
logo redesign