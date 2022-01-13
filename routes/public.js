const express = require('express')
const router = express.Router()

const models = {
    project: require('../models/project'),
    qualification: require('../models/qualification'),
    skill: require('../models/skill'),
    workexperience: require('../models/workExperience'),
    blogpost: require('../models/blogPost')
}

router.get('/:model/:userId', async(req, res) => {
    allowedFields = ['name', 'title', 'slug', '_id']
    try {
        if (!models[req.params.model]) {
            throw new Error('Post type not found', 401)
        }
        const model = models[req.params.model]
        let query = { user: req.params.userId }

        if (req.query.field && req.query.value) {
            if (allowedFields.includes(req.query.field)) {
                query[req.query.field] = req.query.value
            } else {
                throw new Error('Field not allowed', 401)
            }
        }
        const result = await model.find(query)
        res.json(result)
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message })
    }
})

module.exports = router