const bcrypt = require('bcrypt')
const transporter = require('../nodemailer.js')
const UserOTPVerification = require('../models/UserOTPVerification.js')

const sendOTPEmailVerification = async (email, res) => {
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
        const userOtps = await UserOTPVerification.findOne({where: {email}})
        if(userOtps){
            await UserOTPVerification.update({otp: hashedOTP, expiresAt: Date.now()}, {where: {email}})
        }else{
            await UserOTPVerification.create({email, otp: hashedOTP, expiresAt: Date.now() + 3600000})
        }
        const responseSendEmail = await transporter.sendMail(mailOptions)
        if(responseSendEmail.rejected.length > 0){
            res.status(400).json({
                statusCode: 400,
                message: 'Rejected email sending',
                rejected: responseSendEmail.rejected
            })
        }else{
            res.status(200).json({
                statusCode: 200,
                statusEmail: 'PENDING VERIFICATION',
                message: 'Code sent and pending verification',
                email
            })
        }
    }catch(error){
        res.status(500).json({
            statusCode: 500,
            message: 'An error ocurred',
            errorMessage: error.message
        })
    }
}

module.exports = sendOTPEmailVerification