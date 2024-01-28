const express = require('express')
const router = express.Router()
const WorkExperience = require('../models/workExperience')
const Joi = require('joi')

const { authenticateToken } = require('../middlewares/auth')
const { getWorkExperience, workExperienceValidationSchema } = require('../middlewares/workExperience')


// @route   GET api/workExperiences
// @desc    Get all workExperiences
// @access  Public
router.get('/', authenticateToken, async (req, res) => {
    try {
        const workExperiences = await WorkExperience.find({ user: req.user._id, status: { $ne: "deleted" } }).sort({ startDate: 1 });
        res.json(workExperiences);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', authenticateToken, getWorkExperience, (req, res) => {
    res.json(res.workExperience)
})


router.post('/', authenticateToken, async (req, res) => {
    const { error } = workExperienceValidationSchema.validate(req.body)
    if (error) {
        console.log("Work experience validation error", error)
        return res.status(400).json({ message: JSON.stringify(error.details) });
    }

    let workExperienceObj = {
        title: req.body.title,
        subTitle: req.body.subTitle,
        description: req.body.description,
        startDate: req.body.startDate,
        current: req.body.current || false,
        user: req.user,
    }

    if (req.body.endDate) {
        workExperienceObj.endDate = req.body.endDate
    }

    const newWorkExperience = await new WorkExperience(workExperienceObj)
    try {
        await newWorkExperience.save()
        res.status(201).json(newWorkExperience)
    } catch (err) {
        console.log("Error saving work experience", err)
        res.status(400).json({ message: err.message })
    }
})


router.patch('/:id', authenticateToken, getWorkExperience, async (req, res) => {
    const { error } = workExperienceValidationSchema.validate(req.body)
    if (error) {
        console.log("Work experience validation error", error)
        return res.status(400).json({ message: JSON.stringify(error.details) });
    }

    console.log("req.body", req.body)

    if (req.body.subTitle != null) {
        res.workExperience.subTitle = req.body.subTitle
    }
    if (req.body.title != null) {
        res.workExperience.title = req.body.title
    }
    if (req.body.description != null) {
        res.workExperience.description = req.body.description
    }
    if (req.body.startDate != null) {
        res.workExperience.startDate = req.body.startDate
    }
    if (req.body.endDate != null) {
        res.workExperience.endDate = req.body.endDate
    }
    if (req.body.current != null) {
        res.workExperience.current = req.body.current || false
    }
    if (req.body.language != null) {
        res.workExperience.language = req.body.language
    }

    try {
        const updatedWorkExperience = await res.workExperience.save()
        res.json(updatedWorkExperience)
    } catch (err) {
        console.log("Error updating work experience", err)
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', authenticateToken, getWorkExperience, async (req, res) => {
    try {
        res.workExperience.status = "deleted";
        await res.workExperience.save()
        res.status(200).json({ message: 'WorkExperience deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


module.exports = router
