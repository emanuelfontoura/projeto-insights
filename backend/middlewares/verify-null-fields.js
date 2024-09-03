const verifyNullFields = (req, res, next) => {
    const fieldArray = Object.entries(req.body)
    const fieldEmpty = fieldArray.map(field => {
        if(field[1] === "" || field[1] === undefined || field[1] === null){
            return field[0]
        }}).filter(field => field !== undefined)
    if(fieldEmpty.length > 0){
        res.status(422).json({
            statusCode: 422,
            message: `This following fields are empty: ${fieldEmpty.join().replace(/,/g, ', ')}`
        })
        return
    }
    next()
}

module.exports = verifyNullFields

// [ [username, 'oi'], ['password', null] ]