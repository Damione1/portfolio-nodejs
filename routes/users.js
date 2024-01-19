const bcrypt = require('bcrypt');
const express = require('express')

const router = express.Router()

const { User, Settings } = require('../models/user')

const { authenticateToken } = require('../middlewares/auth')
const { getUser, getUserSettings } = require('../middlewares/users')

// @route   GET api/workExperiences
// @desc    Get all workExperiences
// @access  Public
router.get('/', async(req, res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getUser, (req, res) => {
    res.json({ user: res.foundUser })
})


router.post('/', authenticateToken, async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        })
        await newUser.save()
        res.status(201).json(newUser)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})


router.patch('/:id', authenticateToken, getUser, async(req, res) => {
    try {
        if (req.user._id !== res.foundUser._id.toString()) {
            throw new Error('You are not authorized to update this user')
        }

        if (req.body.firstName != null) {
            res.foundUser.firstName = req.body.firstName
        }
        if (req.body.lastName != null) {
            res.foundUser.lastName = req.body.lastName
        }
        if (req.body.email != null) {
            res.foundUser.email = req.body.email
        }
        if (req.body.password != null) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            res.foundUser.password = hashedPassword
        }

        const updatedUser = await res.foundUser.save()
        res.json({ message: 'User updated successfully', user: updatedUser })

    } catch (err) {
        res.status(400).json({ message: err.message, user: {} })
    }
})

router.delete('/:id', authenticateToken, getUser, async(req, res) => {
    try {
        await res.foundUser.remove()
        res.status(200).json({ message: 'User deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


module.exports = router
