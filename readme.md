

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