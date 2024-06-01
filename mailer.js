const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth: {
        user: 'trytobekumar@gmail.com',
        pass: 'ksvboedslfegnmdt'
    }
});


// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });


module.exports = transporter;