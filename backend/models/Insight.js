const { DataTypes } = require('sequelize')
const db = require('../database/conn.js')

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

module.exports = Insight