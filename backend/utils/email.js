// const nodemailer = require('nodemailer');

// const sendEmail = async options => {
//     try {
//         const transport = {
//             host: process.env.SMTP_HOST,
//             port: process.env.SMTP_PORT,
//             secure: process.env.SMTP_SECURE === 'true',
//             auth: {
//                 user: process.env.SMTP_USER,
//                 pass: process.env.SMTP_PASS
//             }
//         };

//         const transporter = nodemailer.createTransport(transport);

//         const message = {
//             from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
//             to: options.email,
//             subject: options.subject,
//             text: options.message
//         };

//         await transporter.sendMail(message);
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error;
//     }
// };


// exports.sendEmail = sendEmail;

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "465", // true for 465, false for 587 or others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
