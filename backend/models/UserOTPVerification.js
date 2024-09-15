const db = require('../database/conn.js')
const { DataTypes } = require('sequelize')

const UserOTPVerification = db.define('UserOTPVerification', {
    userId: {
       type: DataTypes.INTEGER,
       primaryKey: true 
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    }
})