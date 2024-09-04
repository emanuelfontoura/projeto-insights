const jwt = require('jsonwebtoken')
const User = require('../models/User.js')
require('dotenv').config()

const SECRET = process.env.JWT_SECRET

const getUserByToken = async (token) => {
    const decoded = jwt.verify(token, SECRET)
    const id = decoded.id
    const user = await User.findByPk(id)
    return user
}

module.exports = getUserByToken