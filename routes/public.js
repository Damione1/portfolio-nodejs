const express = require('express')
const router = express.Router()

const models = {
    project: require('../models/project'),
    qualification: require('../models/qualification'),
    skill: require('../models/skill'),
    workexperience: require('../models/workExperience')
}

router.get('/:model/:userId', async(req, res) => {
    allowedFields = ['name', 'slug', '_id']
    try {
        const model = models[req.params.model]
        let query = { user: req.params.userId }
        if (req.query.field && req.query.value) {
            query[req.query.field] = req.query.value
        }
        const projects = await model.find(query)
        res.json(projects)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router