const Skill = require('../models/skill')

async function getSkill(req, res, next) {
    let skill
    try {
        skill = await Skill.findById(req.params.id)
        if (null === skill) {
            return res.status(404).json({ message: 'Skill not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.skill = skill
    next()

}

module.exports = { getSkill }