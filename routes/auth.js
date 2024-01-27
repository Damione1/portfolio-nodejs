const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

const { User } = require('../models/user')
const authSchema = require('../models/auth')
const Auth = require('../helpers/auth')
const { authenticateToken, getRefreshToken } = require('../middlewares/auth')
const jwt = require('jsonwebtoken')
const { randomUUID } = require('crypto');
const duration = process.env.TOKEN_DURATION || '5m';
const durationNumber = Number(duration.slice(0, -1)); // convert duration to number

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const userPayload = {
            _id: user._id,
            email: user.email,
            name: user.name,
            sessionId: randomUUID()
        };;

        const accessToken = await Auth.generateAccessToken(userPayload, duration);


        const refreshToken = await Auth.generateRefreshToken(userPayload);

        const newToken = new authSchema({
            user: user._id,
            refreshToken: refreshToken,
            sessionId: userPayload.sessionId,
            userAgent: req.headers['user-agent'],
        });

        await newToken.save();


        return res.status(200).json({
            refresh_token: refreshToken,
            token: accessToken,
            expires_in: durationNumber * 60,
        });


    } catch (err) {
        res.status(500).json({
            message: 'Internal server error.',
            error: err.message
        });
    }
});



router.get('/logout', authenticateToken, async (req, res) => {
    try {
        const { sessionId } = req.user;
        const token = await authSchema.findOne({ sessionId });

        if (!token) {
            return res.status(404).json({ message: 'Session not found.' });
        }

        await token.remove();

        return res.status(200).json({ message: 'Logout successful.' });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error.',
            error: err.message
        });
    }
});


router.post('/refreshToken', async (req, res) => {
    const { refresh_token: refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required.' });
    }

    const tokenUser = await authSchema.findOneAndUpdate(
        { refreshToken },
        { $set: { lastUsed: new Date() } }
    );

    if (!tokenUser) {
        return res.status(403).json({ message: 'Invalid refresh token.' });
    }


    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, token_content) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        try {
            const accessToken = await Auth.generateAccessToken(token_content.user, duration);
            res.json({ token: accessToken, expires_in: durationNumber * 60 });
        } catch (err) {
            res.status(500).json({ message: 'Unable to generate access token.' });
        }
    });
});

router.get('/getCurrentUser', authenticateToken, async (req, res) => {

    try {
        const user = await User.findById(req.user._id)
        user.password = undefined
        user.__v = undefined
        res.json({ user: user })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})

router.get('/userToken', authenticateToken, async (req, res) => {

    try {
        const tokens = await authSchema.find({ user: req.user._id })
        res.json(tokens)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

});


router.delete('/userToken/:id', authenticateToken, getRefreshToken, async (req, res) => {

    try {
        await res.refreshToken.remove()
        res.status(200).json({ message: 'Token deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})




module.exports = router
