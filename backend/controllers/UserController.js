const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createUserToken = require('../helpers/create-user-token.js')
const getTokenHeader = require('../helpers/get-token-header.js')
const getUserByToken = require('../helpers/get-user-by-token.js')
const User = require('../models/User.js')

require('dotenv').config()

const SECRET = process.env.JWT_SECRET

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
            res.status(201).json({
                statusCode: 201,
                message: 'Register successful',
                data:{
                    userAdded
                }
            })
        }catch(error){
            res.status(401).json({
                statusCode: 401,
                message: 'Regiser unsuccessful',
                errorMessage: (error['original'] && error['original']['sqlMessage']) || error
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

    // ainda não entendi a utilidade disso
    // static async checkUserToken(req, res){
    //     let currentUser, token, decoded
    //     try{
    //         token = getTokenHeader(req)
    //         decoded = jwt.verify(token, SECRET)
    //     }catch(error){
    //         res.status(401).json({
    //             statusCode: 401,
    //             message: 'Malformed token',
    //             errorMessage: error.message
    //         })
    //         return
    //     }
    //     if(token){
    //         currentUser = await User.findByPk(decoded.id, {attributes: {exclude: ['password']}})
    //     }else{
    //         currentUser = null
    //     }
    //     res.status(200).json({
    //         statusCode: 200,
    //         currentUser
    //     })
    // }

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

    static async editUserEmail(req, res){
        const {email, confirmEmail, password, userId} = req.body
        if(email !== confirmEmail){
            res.status(422).json({
                statusCode: 422,
                message: 'Email and confirm email are different'
            })
            return
        }
        try{
            const user = await User.findByPk(userId)
            const matchedPassword = await bcrypt.compare(password, user.password)
            if(!matchedPassword){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Invalid password'
                })
                return
            }
            await User.update({email}, {where:{id: userId}})
            res.status(200).json({
                statusCode: 200,
                message: 'Email updated successfully',
                newEmail: email
            })
        }catch(error){
            res.status(500).json({
                statusCode: 500,
                message: 'An error ocurred',
                errorMessage: error.message
            })
        }
    }

    static async editUserPassword(req, res){
        const {oldPassword, newPassword, confirmNewPassword, userId} = req.body
        try{
            const user = await User.findByPk(userId)
            const matchedPassword = await bcrypt.compare(oldPassword, user.password)
            if(!matchedPassword){
                res.status(422).json({
                    statusCode: 422,
                    message: "Invalid 'old password'"
                })
                return
            }
            if(newPassword !== confirmNewPassword){
                res.status(422).json({
                    statusCode: 422,
                    message: "'New password' and 'confirm new password' are different"
                })
                return
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            await User.update({password: hashedPassword}, {where: {id: userId}})
            res.status(200).json({
                statusCode: 200,
                message: 'Password updated successfully',
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
            await User.update({username, phone}, {where: {id:userId}})
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
}