const db = require('../database/conn.js')
const { DataTypes } = require('sequelize')

const UserOTPVerification = db.define('UserOTPVerification', {
    otpId: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: null,
        required: true
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        required: true
    }
})

module.exports = UserOTPVerification