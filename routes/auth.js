const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

const userSchema = require('../models/user')
const authShema = require('../models/auth')
const Auth = require('../helpers/auth')
const { authenticateToken } = require('../middlewares/auth')
const jwt = require('jsonwebtoken')

router.post('/login', async(req, res) => {
    try {
        const user = await userSchema.findOne({ email: req.body.email })

        if (null === user) {
            return res.status(400).json({ message: 'User not found' })
        }

        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = await Auth.generateAccessToken(user)
            const refreshToken = await Auth.generateRefreshToken(user)

            const newToken = await new authShema({
                user: user._id,
                refreshToken: refreshToken
            })
            newToken.save()

            res.status(200).json({ 'token': accessToken, 'refresh_token': refreshToken })
        } else {
            res.status(400).json({ message: 'Invalid password' })
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})

router.post('/refreshToken', async(req, res) => {
    const refreshToken = req.body.refresh_token

    if (refreshToken === null || refreshToken === undefined) {
        return res.status(401).json({ message: 'Missing refresh token' })
    }

    const tokenUser = await authShema.findOne({ refreshToken: refreshToken });

    if (tokenUser === null) {
        return res.status(403).json({ message: 'This token does not exists' })
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, token_content) => {

        if (err) {
            return res.status(403).json({ message: 'Invalid token' })
        }

        Auth.generateAccessToken(token_content.user).then(accessToken => {
            res.json({ token: accessToken })
        })

    })

})

router.get('/getCurrentUser', authenticateToken, async(req, res) => {

    res.json({ user: req.user })

})




module.exports = router