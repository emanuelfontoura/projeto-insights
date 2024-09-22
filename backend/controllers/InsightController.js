const Insight = require('../models/Insight.js')

module.exports = class InsightController{
    static async createInsight(req, res){
        const {content} = req.body
        try{
            await Insight.create({content, likes:0})
            res.status(200).json({
                statusCode: 200,
                message: 'Insight created successfully'
            })
        }catch(error){
            res.status(500).json({
                statusCode: 500,
                message: 'An error ocurred',
                errorMessage: error.message
            })
        }
    }
}