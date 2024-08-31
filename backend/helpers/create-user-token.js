const jwt = require('jsonwebtoken')
require('dotenv').config()

const SECRET = process.env.JWT_SECRET

const createUserToken = async (user, res) => {
    console.log(user)
    try{
        const token = jwt.sign({id:user.id}, SECRET, {expiresIn: '1h'})
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
            errorMessage: error
        })
    }   
}

module.exports = createUserToken