const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const transporter = require('../nodemailer.js')
const { literal } = require('sequelize')
const createUserToken = require('../helpers/create-user-token.js')
const User = require('../models/User.js')
const ResetPasswordsToken = require('../models/ResetPasswordsToken.js')
require('dotenv').config()

const SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT
const EMAIL_USER = process.env.EMAIL_USER

module.exports = class AuthController{

    static async confirmEmailRegister(req, res){
        const token = req.query.token
        if(!token){
            return res.status(400).json({
                statusCode: 400,
                message: 'Token is required'
            })
        }
        let username, email, password, phone
        jwt.verify(token, SECRET, (err, decoded) => {
            if(err){
                return res.status(400).json({ 
                    statusCode: 400,
                    message: 'Invalid or expired token' 
                })
            }
            username = decoded.username
            email = decoded.email
            password = decoded.password
            phone = decoded.phone
        })
        try{

            const userAdded = await User.create({username, email, password, phone})
            userAdded.password = 'protected'
            res.status(200).json({
                statusCode: 200,
                message: 'User created successfully!',
                data: {
                    userAdded
                }
            })
        }catch(error){
            res.status(500).json({
                statusCode: 500,
                message: 'An error occurred when registering user.',
                errorMessage: error.message
            })
        }
    }

    static async register(req, res){
        const {username, email, password, phone, confirmPassword} = req.body
        if(password !== confirmPassword){
            res.status(422).json({
                statusCode: 422,
                message: 'Password and confirm password are differents'
            })
            return
        }
        try{
            const user = await User.findOne({where: {email}})
            if(user){
                res.status(422).json({
                    statusCode: 422,
                    message: 'This user already exists'
                })
                return
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const token = jwt.sign({username, email, password: hashedPassword, phone}, SECRET, {expiresIn: '1h'})
            const link = `http://localhost:${PORT}/confirm-email?token=${token}`
            const mailOptions = {
                from: EMAIL_USER,
                to: email,
                subject: 'Confirm your email',
                html: `
                    <h1>Confirm your email</h1>
                    <p>Click <a href='${link}' target='blank' >here</a> to check your email</p>
                `
            }
            await transporter.sendMail(mailOptions)
            res.status(200).json({
                statusCode: 200,
                statusEmail: 'PENDING',
                message: 'Email sent successfully. Access the registered email to verify it.'
            })
        }catch(error){
            res.status(401).json({
                statusCode: 401,
                message: 'Regiser unsuccessful',
                errorMessage: error.message
            })
        }
    }

    static async login(req, res){
        const {email, password} = req.body
        try{
            const user = await User.findOne({where: {email}})
            const matchedPassword = await bcrypt.compare(password, user.password)
            if(!matchedPassword){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Login unsuccessful. Cause: invalid password'
                })
                return
            }
            await createUserToken(user, res)
        }catch(error){
            res.status(500).json({
                statusCode: 500,
                message: 'Login unsuccessful.',
                errorMessage: error
            })
        }
    }

    static async sendEmailResetPassword(req, res){
        const {email, user} = req.body
        try{
            const token = jwt.sign({userId: user.userId}, SECRET)
            const link = `http://localhost:${PORT}/confirm-email-reset-password?token=${token}`
            await transporter.sendMail({
                from: EMAIL_USER,
                to: email,
                subject: 'Confirm your email to reset password',
                html: `
                <h1>Confirm your email and reset password</h1>
                <p>Click <a href='${link}' target='blank' >here</a> to confirm your email and reset password.</p>
            `
            })
            res.status(200).json({
                statusCode: 200,
                statusEmail: 'PENDING',
                message: 'Email sent successfully. Check your inbox.'
            })
        }catch(error){
            res.status(500).json({
                statusCode: 500,
                message: 'An error occurred while sending the email. Try again!',
                errorMessage: error.message
            })
        }
    }

    static async confirmEmailResetPassword(req, res){
        const token = req.query.token
        const decoded = jwt.verify(token, SECRET, (err, dec) => {
            if(err){
                res.status(500).json({
                    statusCode: 500,
                    message: 'An error occurred while trying to decode the token.',
                    errorMessage: err.message
                })
            }
            return dec
        })
        console.log(decoded)
        const userToken = await ResetPasswordsToken.findOne({where: {userId: decoded.userId}})
        if(userToken){
            await ResetPasswordsToken.update({token, expires_at: Date.now() + 3600000, generatedTokens: literal('generatedTokens + 1')}, {where: {userId: decoded.userId}})
        }else{
            await ResetPasswordsToken.create({token: token, expires_at: Date.now() + 3600000, generatedTokens: 1, userId: decoded.userId})
        }
        res.status(200).json({
            statusCode: 200,
            statusEmail: 'VERIFIED'
        })
    }

    static async setNewPassword(req, res){
        const {email, newPassword, confirmNewPassword} = req.body
        if(newPassword !== confirmNewPassword){
            res.status(400).json({
                statusCode: 400,
                message: 'Password and password confirmation do not match.'
            })
            return
        }
        try{
            const user = await User.findOne({
                where: {email},
                attributes: ['userId']
            })
            const token = await ResetPasswordsToken.findOne({where: {userId: user.userId}})
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            if(!token){
                res.status(400).json({
                    statusCode: 400,
                    message: 'You need to check your email first!'
                })
            }else if(Date.now() > token.expires_at){
                res.status(400).json({
                    statusCode: 400,
                    message: 'This token has passed its valid time. Generate another token and try again!'
                })
            }else{
                await User.update({password: hashedPassword}, {where: {email}})
                res.status(200).json({
                    statusCode: 200,
                    message: 'Password changed successfully.'
                })
            }
        }catch(error){
            res.status(500).json({
                statusCode: 500,
                message: 'An error occurred when trying to change the password.',
                errorMessage: error.message
            })
        }
    }
}