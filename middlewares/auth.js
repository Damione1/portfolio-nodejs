require('dotenv').config();
const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/auth')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user.user
        next()
    })
}

async function getRefreshToken(req, res, next) {
    let refreshToken
    try {
        refreshToken = await RefreshToken.findById(req.params.id)
        if (null === refreshToken) {
            return res.status(404).json({ message: 'RefreshToken not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.refreshToken = refreshToken
    next()

}


module.exports = { authenticateToken, getRefreshToken }
