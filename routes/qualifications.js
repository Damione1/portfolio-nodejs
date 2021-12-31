const express = require('express')
const router = express.Router()
const Qualification = require('../models/qualification')

const { authenticateToken } = require('../middlewares/auth')
const { getQualification } = require('../middlewares/qualification')


// @route   GET api/qualifications
// @desc    Get all qualifications
// @access  Public
router.get('/', authenticateToken, async(req, res) => {
    try {
        const qualifications = await Qualification.find({ user: req.user._id })
        res.json(qualifications)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/public/:id', async(req, res) => {
    try {
        const qualification = await Qualification.find({ user: req.params.id })
        res.json(qualification)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', authenticateToken, getQualification, (req, res) => {
    res.json(res.qualification)
})


router.post('/', authenticateToken, async(req, res) => {
    console.log(req.user);
    const newQualification = await new Qualification({
        school: req.body.school,
        grade: req.body.grade,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        user: req.user,
    })
    try {
        await newQualification.save()
        res.status(201).json(newQualification)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


router.patch('/:id', authenticateToken, getQualification, async(req, res) => {

    console.log(req.user);

    if (req.body.school != null) {
        res.qualification.school = req.body.school
    }
    if (req.body.grade != null) {
        res.qualification.grade = req.body.grade
    }
    if (req.body.description != null) {
        res.qualification.description = req.body.description
    }
    if (req.body.startDate != null) {
        res.qualification.startDate = req.body.startDate
    }
    if (req.body.endDate != null) {
        res.qualification.endDate = req.body.endDate
    }
    if (req.body.current != null) {
        res.qualification.current = req.body.current
    }
    if (req.body.language != null) {
        res.qualification.language = req.body.language
    }

    try {
        const updatedQualification = await res.qualification.save()
        res.json(updatedQualification)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})

router.delete('/:id', authenticateToken, getQualification, async(req, res) => {

    try {
        await res.qualification.remove()
        res.status(200).json({ message: 'Qualification deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})


module.exports = router