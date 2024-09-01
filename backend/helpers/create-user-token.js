const jwt = require('jsonwebtoken')
require('dotenv').config()

const SECRET = process.env.JWT_SECRET

const createUserToken = async (user, res) => {
    try{
        const token = jwt.sign({id:user.id, username: user.username}, SECRET, {expiresIn: '1h'})
        res.status(200).json({
            statusCode: 200,
            message: 'Successful authentication',
            token: token,
            userId: user.id
        })
    }catch(error){
        res.status(500).json({
            statusCode: 500,
            message: 'Unsuccessful authentication. Cause: error generating token',
            errorMessage: error.message
        })
    }   
}

module.exports = createUserToken