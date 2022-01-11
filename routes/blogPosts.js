const express = require('express')
const router = express.Router()
const BlogPost = require('../models/blogPost')
const slugify = require('slugify')

const { authenticateToken } = require('../middlewares/auth')
const { getBlogPost } = require('../middlewares/blogPost')


router.get('/', authenticateToken, async(req, res) => {
    try {
        const blogPosts = await BlogPost.find({ user: req.user._id })
        res.json(blogPosts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', authenticateToken, getBlogPost, (req, res) => {
    res.json(res.blogPost)
})


router.post('/', authenticateToken, async(req, res) => {
    const newBlogPost = await new BlogPost({
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        category: req.body.category,
        images: req.body.images,
        user: req.user._id,
        slug: slugify(`${new Date().toISOString().slice(0, 10) } ${req.body.name}`, { lower: true })
    })
    try {
        await newBlogPost.save()

        await newBlogPost.update({
            $push: {
                images: {
                    $each: req.body.images
                }
            }
        })

        res.status(201).json(newBlogPost)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


router.patch('/:id', authenticateToken, getBlogPost, async(req, res) => {

    if (req.body.title !== null) {
        res.blogPost.title = req.body.title
        res.blogPost.slug = slugify(`${new Date(res.blogPost.date).toISOString().slice(0, 10) } ${req.body.title}`, { lower: true })
    }

    if (req.body.excerpt !== null) {
        res.blogPost.excerpt = req.body.excerpt
    }

    if (req.body.content !== null) {
        res.blogPost.content = req.body.content
    }

    if (req.body.tag !== null) {
        res.blogPost.tag = req.body.tag
    }

    if (req.body.images !== null) {
        await res.blogPost.update({
            $set: {
                images: req.body.images
            }
        })
    }

    try {
        const updatedBlogPost = await res.blogPost.save()
        res.json(updatedBlogPost)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})

router.delete('/:id', authenticateToken, getBlogPost, async(req, res) => {

    try {
        await res.blogPost.remove()
        res.status(200).json({ message: 'BlogPost deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})


module.exports = router