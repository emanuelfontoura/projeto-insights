const { DataTypes } = require('sequelize')
const db = require('../database/conn.js')

const User = db.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        required:true,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING,
        required:true,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        required:true,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        required:true,
        allowNull:false
    },
    phone:{
        type: DataTypes.STRING,
        required: false,
        allowNull: true
    }
})

module.exports = User