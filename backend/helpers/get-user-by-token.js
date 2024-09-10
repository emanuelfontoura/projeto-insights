const jwt = require('jsonwebtoken')
const User = require('../src/app/models/User.js')
require('dotenv').config()

const SECRET = process.env.JWT_SECRET

const getUserByToken = async (token) => {
    const decoded = jwt.verify(token, SECRET)
    const userId = decoded.userId
    const user = await User.findByPk(userId)
    return user
}

module.exports = getUserByToken