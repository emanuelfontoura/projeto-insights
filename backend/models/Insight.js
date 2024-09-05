const { DataTypes } = require('sequelize')
const db = require('../db/conn.js')
const User = require('./User.js')

const Insight = db.define('Insight', {
    insightId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    likes:{
        type: DataTypes.INTEGER,
    }
})

Insight.belongsTo(User, {
    constraints: true,
    foreignKey: 'userId'
})

User.hasMany(Insight, {
    foreignKey: 'userId',
})

module.exports = Insight