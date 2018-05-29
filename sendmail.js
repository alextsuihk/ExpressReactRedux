const appConfig = require('./config.js');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: appConfig.smtp.host,
  port: appConfig.smtp.port,
  secure: appConfig.smtp.ssl,
  auth: {
    user: appConfig.smtp.username,
    pass: appConfig.smtp.password,
  },
});

function passwordReset(mailTo, hashKey, callback) {
  // setup email data with unicode symbols

  const mailOptions = {
    from: `"${appConfig.smtp.sender}" <${appConfig.smtp.sendFrom}>`, // sender address
    to: `"${mailTo}" <${mailTo}>`, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<p>A password reset has been requested. 
          If you made this request, please click the following link: 
          <a href="http://localhost:3000/account/password-reset-confirm/${hashKey}" target="_blank">
          http:/localhost:3000/account/password-reset-confirm/${hashKey}</a></p>
          <p>If you didn't make this request, feel free to ignore it!</p>
          <p>Reset Link is valid for ${appConfig.auth.passwordResetValidInMins} mins </p>`, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error);
    }
    callback(null, info.messageId);
  });
}

module.exports = { passwordReset };
