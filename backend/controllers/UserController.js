const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createUserToken = require('../helpers/create-user-token.js')
const getTokenHeader = require('../helpers/get-token-header.js')
const User = require('../models/User.js')
require('dotenv').config()

const SECRET = process.env.JWT_SECRET

module.exports = class AuthController{

    static async register(req, res){
        const {username, email, password, phone, confirmPassword} = req.body
        try{
            if(!username){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Register unsuccessful. Cause: username not filled'
                })
                return
            }
            if(!email){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Register unsuccessful. Cause: email not filled'
                })
                return
            }
            if(!password){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Register unsuccessful. Cause: password not filled'
                })
                return
            }
            if(!phone){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Register unsuccessful. Cause: phone not filled'
                })
                return
            }
            if(!confirmPassword){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Register unsuccessful. Cause: password confirmation not filled'
                })
                return
            }
            if(confirmPassword !== password){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Register unsuccessful. Cause: password confirmation and password must be the same'
                })
                return
            }
            const userExists = await User.findOne({where: {email}})
            if(userExists){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Register unsuccessful. Cause: the email already exists in this database',
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
        if(!email){
            res.status(422).json({
                statusCode: 422,
                message: 'Login unsuccessful. Cause: email is not filled'
            })
            return
        }
        if(!password){
            res.status(422).json({
                statusCode: 422,
                message: 'Login unsuccessful. Cause: password is not filled'
            })
            return
        }
        try{
            const user = await User.findOne({where:{email}})
            if(!user){
                res.status(422).json({
                    statusCode: 422,
                    message: 'Login unsuccessful. Cause: user not exists'
                })
                return
            }
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

    static async checkUserToken(req, res){
        let currentUser, token, decoded
        try{
            token = getTokenHeader(req)
            decoded = jwt.verify(token, SECRET)
        }catch(error){
            res.status(401).json({
                statusCode: 401,
                message: 'Malformed token',
                errorMessage: error.message
            })
            return
        }
        if(token){
            currentUser = await User.findByPk(decoded.id, {attributes: {exclude: ['password']}})
        }else{
            currentUser = null
        }
        res.status(200).json({
            statusCode: 200,
            currentUser
        })
    }

    static async getUserById(req, res){
        const id = req.params.id
        const user = await User.findByPk(id, {attributes: {exclude: ['password']}})
        if(!user){
            res.status(422).json({
                statusCode: 422,
                message: 'User not found'
            })
            return
        }
        res.status(200).json({
            statusCode: 200,
            user
        })
    }

    static async editUser(req, res){
        res.status(200).send('deu certo')
    }
}