const { User } = require('../models/user')
const userSettingsSchema = require('../models/user')

async function getUser(req, res, next) {
    let foundUser
    try {
        foundUser = await User.findById(req.params.id, '-__v')
        if (null === foundUser) {
            return res.status(404).json({ message: 'User not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.foundUser = foundUser
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