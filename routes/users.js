const bcrypt = require('bcrypt');
const express = require('express')

const router = express.Router()

const { User } = require('../models/user')

const { authenticateToken } = require('../middlewares/auth')
const { getUser, getUserSettings } = require('../middlewares/users')

// @route   GET api/workExperiences
// @desc    Get all workExperiences
// @access  Public
router.get('/', async(req, res) => {
    try {
        const workExperiences = await User.find()
        res.json(workExperiences)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getUser, (req, res) => {
    res.json(res.workExperience)
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

    if (req.body.firstName != null) {
        res.user.firstName = req.body.firstName
    }
    if (req.body.lastName != null) {
        res.user.lastName = req.body.lastName
    }
    if (req.body.email != null) {
        res.user.email = req.body.email
    }

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})

router.delete('/:id', authenticateToken, getUser, async(req, res) => {

    try {
        await res.user.remove()
        res.status(200).json({ message: 'User deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})

/* /settings endpoint */
router.get('/:id/settings', authenticateToken, getUserSettings, async(req, res) => {
    res.json(res.userSettings)
})

/* post settings endpoint */
router.post('/:id/settings', authenticateToken, getUserSettings, async(req, res) => {
    try {
        const newUserSettings = await new userSettingsSchema({
            user: req.params.id,
            mainTitle: req.body.mainTitle,
            mainSubtitle: req.body.mainSubtitle,
            workExperiencesTitle: req.body.workExperiencesTitle,
            workExperiencesSubtitle: req.body.workExperiencesSubtitle,
            qualificationsTitle: req.body.qualificationsTitle,
            qualificationsSubtitle: req.body.qualificationsSubtitle
        })
        await newUserSettings.save()
        res.status(201).json(newUserSettings)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

/* patch settings endpoint */
router.patch('/:id/settings', authenticateToken, getUserSettings, async(req, res) => {

    if (req.body.mainTitle != null) {
        res.userSettings.mainTitle = req.body.mainTitle
    }
    if (req.body.mainSubtitle != null) {
        res.userSettings.mainSubtitle = req.body.mainSubtitle
    }
    if (req.body.workExperiencesTitle != null) {

        res.userSettings.workExperiencesTitle = req.body.workExperiencesTitle
    }
    if (req.body.workExperiencesSubtitle != null) {
        res.userSettings.workExperiencesSubtitle = req.body.workExperiencesSubtitle
    }
    if (req.body.qualificationsTitle != null) {
        res.userSettings.qualificationsTitle = req.body.qualificationsTitle
    }
    if (req.body.qualificationsSubtitle != null) {
        res.userSettings.qualificationsSubtitle = req.body.qualificationsSubtitle
    }

    try {
        const updatedUserSettings = await res.userSettings.save()
        res.json(updatedUserSettings)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})

/* public user endpoint */
router.get('/:id/public', getUser, async(req, res) => {
    res.json(res.user)
})


module.exports = router