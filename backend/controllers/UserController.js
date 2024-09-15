const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createUserToken = require('../helpers/create-user-token.js')
const getTokenHeader = require('../helpers/get-token-header.js')
const getUserByToken = require('../helpers/get-user-by-token.js')
const transporter = require('../nodemailer.js')
const User = require('../models/User.js')

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
            await transporter.sendMail({
                from: 'teste@gmail.com',
                to: email,
                subject: 'Conta criada com sucesso',
                text: 'Sua conta foi criada com sucesso!'
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

    static async confirmUserEmail(req, res){

    }
}