const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define the email options
  const emailOptions = {
    from: 'DocPatient Nexus" <no-reply@docpatientnexus.com>',
    to: options.to,
    subject: options.subject,
    message: options.message,
    html: options.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
