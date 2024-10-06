const { DataTypes } = require('sequelize')
const db = require('../database/conn.js')
const ResetPasswordsToken = require('../models/ResetPasswordsToken.js')
const Insight = require('../models/Insight.js')

const User = db.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: true
    }
})

User.hasMany(ResetPasswordsToken, { foreignKey: 'userId' });
ResetPasswordsToken.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Insight, { foreignKey: 'userId' })
Insight.belongsTo(User, { foreignKey: 'userId' })

module.exports = User