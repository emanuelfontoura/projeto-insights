const { DataTypes } = require('sequelize')
const db = require('../database/conn.js')

const ResetPasswordsToken = db.define('ResetPasswordsToken', {
    tokenId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    generatedTokens: {
        type: DataTypes.INTEGER,
    }
})

module.exports = ResetPasswordsToken