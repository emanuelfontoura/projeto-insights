const bcrypt = require('bcrypt')
const transporter = require('../nodemailer.js')
const UserOTPVerification = require('../models/UserOTPVerification.js')

const sendOTPEmailVerification = async ({userId, email}, res) => {
    try{
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Verify your email',
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign up</p><p>This code expires in 1 hour</p>`
        }
        const salt = await bcrypt.genSalt(10)
        const hashedOTP = await bcrypt.hash(otp, salt)
        const userExists = await UserOTPVerification.findByPk(userId)
        if(userExists){
            await UserOTPVerification.update({otp: hashedOTP, expiresAt: Date.now() + 3600000}, {where: {userId}})
        }else{
            await UserOTPVerification.create({userId, otp: hashedOTP, expiresAt: Date.now() + 3600000})
        }
        await transporter.sendMail(mailOptions)
        res.json({
            status: 'PENDING',
            message: 'Verification OTP email sent',
            data: {
                userId,
                email
            }
        })
    }catch(error){
        res.status(500).json({
            statusCode: 500,
            message: 'An error ocurred',
            errorMessage: error.message
        })
    }
}

module.exports = sendOTPEmailVerification