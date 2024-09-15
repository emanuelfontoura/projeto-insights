const User = require("../models/User")

const verifyUserExists = async (req, res, next) => {
    let identifier
    if(req.params.userId){
        identifier = {userId: req.params.userId}
    }else if(req.body.email){
        identifier = {email: req.body.email}
    }else if(req.body.user){
        identifier = {userId: req.body.userId}
    }else{
        res.status(422).json({
            statusCode: 422,
            message: 'Email or id is required to verify the user'
        })
        return
    }
    try{
        const user = await User.findOne({where: {...identifier}, attributes:{exclude: ['password']}})
        if(!user){
            res.status(422).json({
                statusCode: 422,
                message: 'This user not exists'
            })
            return
        }
        req.body.user = user
        next()
    }catch(error){
        res.status(500).json({
            statusCode: 500,
            message: 'An error ocurred',
            errorMessage: error.message
        })
    }
}

module.exports = verifyUserExists