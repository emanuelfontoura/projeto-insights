const bcrypt = require('bcrypt')
const createUserToken = require('../helpers/create-user-token.js')
const User = require('../models/User.js')
const sendOTPEmailVerification = require('../helpers/send-otp-email-verification.js')
const UserOTPVerification = require('../models/UserOTPVerification.js')

module.exports = class AuthController{

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
            const userAdded = await User.create({
                username,
                email,
                password: hashedPassword,
                phone
            })
            await sendOTPEmailVerification(userAdded, res)
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

    static async getUserData(req, res){
        const {userId} = req.body
        try{
            const user = await User.findByPk(userId)
            res.status(200).json({
                statusCode: 200,
                user
            })
        }catch(error){
            res.status(500).json({
                statusCode: 500,
                message: 'An error ocurred',
                errorMessage: error.message
            })
        }
    }

    static async editUserInfos(req, res){
        const {username, phone, userId} = req.body
        try{
            await User.update({username, phone}, {where: {userId:userId}})
            res.status(200).json({
                statusCode: 200,
                message: 'Information updated successfully'
            })
        }catch(error){
            res.status(500).json({
                statusCode: 500,
                message: 'An error ocurred',
                errorMessage: error.message
            })
        }
    }

    static async resetUserPassword(req, res){
        
    }

    static async verifyUserEmailCode(req, res){
        let {user, otp} = req.body
        const userOTPVerificationRecords = await UserOTPVerification.findByPk(user.userId)
        if(!userOTPVerificationRecords){
            res.status(422).json({
                statusCode: 422,
                message: "Account record doesn't exist or has been verified already. Please, sign up or log in."
            })
            return
        }
        const expiresAt = userOTPVerificationRecords.expiresAt
        const hashedOTP = userOTPVerificationRecords.otp
        if(expiresAt < Date.now()){
            res.status(422).json({
                statusCode: 422,
                message: 'User code has expired. Please, request again.'
            })
            return
        }
        const matchedOTP = await bcrypt.compare(otp, hashedOTP)
        if(!matchedOTP){
            res.json({
                status: 'NOT VERIFIED',
                message: 'Invalid code passed. Check your inbox.'
            })
            return
        }
        await User.update({verified: true}, {where: {userId: user.userId}})
        res.json({
            status: 'VERIFIED',
            message: 'Email confirmed successfully.'
        })
    }
}