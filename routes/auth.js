const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

const userSchema = require('../models/user')
const authSchema = require('../models/auth')
const Auth = require('../helpers/auth')
const { authenticateToken, getRefreshToken } = require('../middlewares/auth')
const jwt = require('jsonwebtoken')
const { randomUUID } = require('crypto');

router.post('/login', async(req, res) => {
    try {
        const user = await userSchema.findOne({ email: req.body.email })

        if (null === user) {
            return res.status(400).json({ message: 'User not found' })
        }

        if (await bcrypt.compare(req.body.password, user.password)) {

            const userPayload = {
                _id: user._id,
                email: user.email,
                name: user.name,
                sessionId: randomUUID()
            }

            const accessToken = await Auth.generateAccessToken(userPayload)
            const refreshToken = await Auth.generateRefreshToken(userPayload)

            const newToken = await new authSchema({
                user: user._id,
                refreshToken: refreshToken,
                sessionId: userPayload.sessionId,
                userAgent: req.headers['user-agent']
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

router.get('/logout', authenticateToken, async(req, res) => {
    try {
        const token = await authSchema.findOne({ sessionId: req.user.sessionId })

        token.remove()
        res.status(200).json({ message: 'Logout success' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})

router.post('/refreshToken', async(req, res) => {
    const refreshToken = req.body.refresh_token

    if (refreshToken === null || refreshToken === undefined) {
        return res.status(401).json({ message: 'Missing refresh token' })
    }

    const tokenUser = await authSchema.findOneAndUpdate({ refreshToken: refreshToken }, { $set: { lastUsed: new Date() } });

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

router.get('/userToken', authenticateToken, async(req, res) => {

    try {
        const tokens = await authSchema.find({ user: req.user._id })
        res.json(tokens)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

});


router.delete('/userToken/:id', authenticateToken, getRefreshToken, async(req, res) => {

    try {
        await res.refreshToken.remove()
        res.status(200).json({ message: 'WorkExperience deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})




module.exports = router