const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const slugify = require('slugify')

const { authenticateToken } = require('../middlewares/auth')
const { getProject } = require('../middlewares/project')


router.get('/', authenticateToken, async(req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id })
        res.json(projects)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', authenticateToken, getProject, (req, res) => {
    res.json(res.project)
})


router.post('/', authenticateToken, async(req, res) => {
    console.log(req);
    const newProject = await new Project({
        name: req.body.name,
        description: req.body.description,
        link: req.body.link,
        stack: req.body.stack,
        user: req.user,
        slug: slugify(`${new Date().toISOString().slice(0, 10) } ${req.body.name}`, { lower: true })
    })
    try {
        await newProject.save()

        await newProject.update({
            $push: {
                images: {
                    $each: req.body.images
                }
            }
        })

        res.status(201).json(newProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


router.patch('/:id', authenticateToken, getProject, async(req, res) => {

    if (req.body.name !== null) {
        res.project.name = req.body.name
        res.project.slug = slugify(`${new Date().toISOString().slice(0, 10) } ${req.project.name}`, { lower: true })

    }

    if (req.body.description !== null) {
        res.project.description = req.body.description
    }

    if (req.body.link !== null) {
        res.project.link = req.body.link
    }

    if (req.body.stack !== null) {
        res.project.stack = req.body.stack
    }

    if (req.body.language !== null) {
        res.project.language = req.body.language
    }

    if (req.body.images !== null) {
        await res.project.update({
            $set: {
                images: req.body.images
            }
        })
    }

    try {
        const updatedProject = await res.project.save()
        res.json(updatedProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})

router.delete('/:id', authenticateToken, getProject, async(req, res) => {

    try {
        await res.project.remove()
        res.status(200).json({ message: 'Project deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})


module.exports = router