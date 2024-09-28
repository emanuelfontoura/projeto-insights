const nodemailer = require('nodemailer')
require('dotenv').config

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

module.exports = transporter