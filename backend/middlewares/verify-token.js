const jwt = require('jsonwebtoken')
const getTokenHeader = require('../helpers/get-token-header')
require('dotenv').config()

const SECRET = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    if(!req.headers["authorization"]){
        res.status(401).json({
            statusCode: 401,
            message: 'Access denied'
        })
        return
    }
    const token = getTokenHeader(req)
    if(!token){
        res.status(401).json({
            statusCode: 401,
            message: 'Access denied'
        })
        return
    }
    try{
        const verified = jwt.verify(token, SECRET)
        req.body.userId = verified.userId
        next()
    }catch(error){
        res.status(400).json({
            statusCode: 400,
            message: 'Invalid token'
        })
    }
}

module.exports = verifyToken