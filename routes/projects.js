const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const slugify = require('slugify')
const Joi = require('joi')

const { authenticateToken } = require('../middlewares/auth')
const { getProject, projectValidationSchema, idValidationSchema } = require('../middlewares/project')

router.get('/', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id, status: { $ne: "deleted" } });
        res.json(projects)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

router.get('/:id', authenticateToken, getProject, (req, res) => {
    res.json(res.project)
})

router.post('/', authenticateToken, async (req, res) => {
    const { error } = projectValidationSchema.validate(req.body)
    if (error) {
        console.log("Project post validation error", error)
        return res.status(400).json({ message: JSON.stringify(error.details) });
    }

    const newProject = new Project({
        title: req.body.title,
        content: req.body.content,
        images: req.body.images,
        link: req.body.link,
        tags: req.body.tags,
        user: req.user._id,
        excerpt: req.body.excerpt,
        status: "published",
        slug: slugify(`${new Date().toISOString().slice(0, 10)} ${req.body.title}`, { lower: true })
    })
    try {
        await newProject.save()

        if (req.body.images?.length > 0) {
            const validImages = req.body.images.filter(image => image._id);
            await newProject.updateOne({
                $push: {
                    images: {
                        $each: validImages
                    }
                }
            });
        }



        res.status(201).json(newProject)
    } catch (err) {
        console.error(err.message)
        res.status(400).json({ message: 'Server error' })
    }
})

router.patch('/:id', authenticateToken, getProject, async (req, res) => {
    const { error } = projectValidationSchema.validate(req.body)
    if (error) {
        console.log("Project patch validation error", error)
        return res.status(400).json({ message: JSON.stringify(error.details) });
    }

    try {
        if (req.body.title !== null) {
            res.project.title = req.body.title
            res.project.slug = slugify(`${new Date(res.project.createdAt).toISOString().slice(0, 10)} ${req.body.title}`, { lower: true })
        }

        if (req.body.content !== null) {
            res.project.content = req.body.content
        }

        if (req.body.excerpt !== null) {
            res.project.excerpt = req.body.excerpt
        }

        if (req.body.link !== null) {
            res.project.link = req.body.link
        }

        if (req.body.tags !== null) {
            res.project.tags = req.body.tags
        }

        if (req.body.language !== null) {
            res.project.language = req.body.language
        }

        if (req.body.images !== null) {
            await res.project.updateOne({
                $set: {
                    images: req.body.images
                }
            })
        }
        const updatedProject = await res.project.save()
        res.json(updatedProject)
    } catch (err) {
        console.error(err.message)
        res.status(400).json({ message: 'Server error' })
    }
})

router.delete('/:id', authenticateToken, getProject, async (req, res) => {
    try {
        res.project.status = "deleted";
        await res.project.save()
        res.status(200).json({ message: 'Project deleted' })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router
