'use strict';

const nodemailer = require('nodemailer');

var auth = {
    type: 'OAuth2',
    user: 'mailcomingfrom@gmail.com',
    pass: "m@1lS3rv3r",
    to: 'ajayvarghese003@gmail.com',
};

function main (mailParams) {
  console.log('MAIL PARAMS', mailParams);
    var mailOptions = {
      from: mailParams.name,
      to: auth.to,
      subject: 'Portfolio: Contact Info -' + mailParams.name,
      text: mailParams.message,
      html: `<h1 style="margin: 5px 0; font-size: 20px; font-weight: 500;">
        Mail from portfolio Site
      </h1>
      <div style='color: #2e2e2e; padding-bottom: 10px; padding-top: 10px; border-top: 1px solid #e6e6e6'>
      Name: ${mailParams.name}
      </div>
      <div style='color: #2e2e2e; padding-bottom: 10px'>
      Email: ${mailParams.email}
      </div>
      <div style='color: #2e2e2e; padding-bottom: 10px'>
      Contact no: ${mailParams.phone}
      </div>
      <div style='color: #2e2e2e; padding-bottom: 10px; padding-top: 10px; border-top: 1px solid #e6e6e6; border-bottom: 1px solid #e6e6e6'>
      Message: <br />
      ${mailParams.message}
      </div>`,

    };
    
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: auth.user,
            pass: auth.pass,
        },  
    });

    transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
        console.log(err)
        return err;
      } else {
        console.log(res); 
        return res;
      }
    });
} 

module.exports = main;

// main().catch(err => {
//     console.error(err.message);
//     process.exit(1);
// });