const getTokenHeader = (req) => {
    const tokenHeader = req.headers["authorization"]
    const token = tokenHeader && tokenHeader.split(" ")[1]
    return token
}

module.exports = getTokenHeader