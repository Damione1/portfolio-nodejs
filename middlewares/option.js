const Option = require('../models/option')

async function getOption(req, res, next) {
    let option
    try {
        option = await Option.findById(req.params.id)
        if (null === option) {
            return res.status(404).json({ message: 'Option not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.option = option
    next()

}

module.exports = { getOption }