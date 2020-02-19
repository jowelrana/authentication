const jwt = require('jsonwebtoken')

const config = require('../config.json')

const Authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, config.secret)
        req.user = decode
        next()
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized',
        })
    }
}

module.exports = Authentication
