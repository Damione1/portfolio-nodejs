const express = require('express')
const router = express.Router()

const models = {
    project: require('../models/project'),
    qualification: require('../models/qualification'),
    skill: require('../models/skill'),
    workexperience: require('../models/workExperience'),
    blogpost: require('../models/blogPost')
}

const fieldMappings = {
    workExperience: {
        position: 'title',
        company: 'subtitle'
    },
    qualification: {
        school: 'title',
        grade: 'subtitle'
    }
}

router.get('/:model/:userId', async (req, res) => {
    allowedFields = ['name', 'title', 'slug', '_id']
    try {
        if (!models[req.params.model]) {
            throw new Error('Post type not found', 401)
        }
        const model = models[req.params.model]
        let query = { user: req.params.userId, status: { $ne: "deleted" } };
        let sort = {};

        if (req.query.field && req.query.value) {
            if (allowedFields.includes(req.query.field)) {
                query[req.query.field] = req.query.value
            } else {
                throw new Error('Field not allowed', 401)
            }
        }

        if (req.params.model === 'workexperience' || req.params.model === 'qualification') {
            sort = { startDate: -1 }; // descending order
        } else if (req.params.model === 'project' || req.params.model === 'blogpost') {
            sort = { date: -1 }; // descending order
        } else if (req.params.model === 'skill') {
            sort = { value: -1 }; // by skill value
        }

        const result = await model.find(query).sort(sort);

        if (fieldMappings[req.params.model]) {
            const mapping = fieldMappings[req.params.model];
            result.forEach(item => {
                for (const key in mapping) {
                    if (item[key]) {
                        item[mapping[key]] = item[key];
                        delete item[key];
                    }
                }
            });
        }

        res.json(result)
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message })
    }
})

module.exports = router
