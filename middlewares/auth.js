require('dotenv').config();
const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/auth')

const Joi = require('joi');

const tokenSchema = Joi.object({
    authorization: Joi.string().pattern(/Bearer .+/).required()
}).unknown(true); // Allow other headers

function authenticateToken(req, res, next) {
    const { error } = tokenSchema.validate(req.headers);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user.user
        next()
    })
}


function authenticateUserForPublicPost(req, res, next) {
    const userId = req.headers['userid']
    if (userId === null) return res.sendStatus(401)

    req.user = user.user
    next()
}

const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required()
});

async function getRefreshToken(req, res, next) {
    const { error } = refreshTokenSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

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


module.exports = { authenticateToken, authenticateUserForPublicPost, getRefreshToken }
