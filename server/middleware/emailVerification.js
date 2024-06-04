const nodemailer = require("nodemailer");
require("dotenv").config(); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// account email verification

const sendVerificationEmail = async (userEmail, verificationToken) => {
  const verificationUrl = `http://localhost:4200/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL, 
    to: userEmail, 
    subject: "Verify Your Email",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);
  } catch (error) {
    console.error("Error sending verification email", error);
  }
};

module.exports = { sendVerificationEmail };
