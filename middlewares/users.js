const User = require('../models/user')
const userSettingsSchema = require('../models/user')

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (null === user) {
            return res.status(404).json({ message: 'User not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()

}

/* get user settings from userSettingsSchema */
async function getUserSettings(req, res, next) {
    let userSettings
    try {
        userSettings = await userSettingsSchema.findOne({ user: req.params.id })
        if (null === userSettings) {
            return res.status(404).json({ message: 'User not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.userSettings = userSettings
    next()
}


module.exports = { getUser, getUserSettings }