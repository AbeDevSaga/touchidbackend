require('dotenv').config(); 
EMAIL_USER="abbed3803@gmail.com";
EMAIL_PASS="swqt efwf tpzu dcgk";

const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmail service
      auth: {
        user: EMAIL_USER, // Your email
        pass: EMAIL_PASS, // Your app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = sendEmail;
