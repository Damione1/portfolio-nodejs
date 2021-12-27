const express = require('express')
const router = express.Router()
const Skill = require('../models/skill')

const { authenticateToken } = require('../middlewares/auth')
const { getSkill } = require('../middlewares/skill')


// @route   GET api/skills
// @desc    Get all skills
// @access  Public
router.get('/', authenticateToken, async(req, res) => {
    try {
        const skills = await Skill.find({ user: req.user._id })
        res.json(skills)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', authenticateToken, getSkill, (req, res) => {
    res.json(res.skill)
})


router.post('/', authenticateToken, async(req, res) => {
    console.log(req.user);
    const newSkill = await new Skill({
        name: req.body.name,
        value: req.body.value,
        user: req.user,
    })
    try {
        await newSkill.save()
        res.status(201).json(newSkill)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


router.patch('/:id', authenticateToken, getSkill, async(req, res) => {

    console.log(req.user);

    if (req.body.name != null) {
        res.skill.name = req.body.name
    }
    if (req.body.value != null) {
        res.skill.value = req.body.value
    }
    if (req.body.language != null) {
        res.skill.language = req.body.language
    }

    try {
        const updatedSkill = await res.skill.save()
        res.json(updatedSkill)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})

router.delete('/:id', authenticateToken, getSkill, async(req, res) => {

    try {
        await res.skill.remove()
        res.status(200).json({ message: 'Skill deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})


module.exports = router