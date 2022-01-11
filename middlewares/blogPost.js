const BlogPost = require('../models/blogPost')

async function getBlogPost(req, res, next) {
    let blogPost
    try {
        blogPost = await BlogPost.findById(req.params.id)
        if (null === blogPost) {
            return res.status(404).json({ message: 'BlogPost not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    try {
        blogPost = await blogPost.populate('images', '-user -date -__v')
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.blogPost = blogPost
    next()

}

module.exports = { getBlogPost }