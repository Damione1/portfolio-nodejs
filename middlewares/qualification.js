const Qualification = require('../models/qualification')

async function getQualification(req, res, next) {
    let qualification
    try {
        qualification = await Qualification.findById(req.params.id)
        if (null === qualification) {
            return res.status(404).json({ message: 'Qualification not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.qualification = qualification
    next()

}

module.exports = { getQualification }