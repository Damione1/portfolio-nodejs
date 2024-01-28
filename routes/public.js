const express = require('express');
const router = express.Router();
const Joi = require('joi');

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

const sortFields = {
    workexperience: { startDate: -1 },
    qualification: { startDate: -1 },
    project: { date: -1 },
    blogpost: { date: -1 },
    skill: { value: -1 }
};

const allowedFields = ['name', 'title', 'slug', '_id']

const schema = Joi.object({
    model: Joi.string().valid(...Object.keys(models)).required(),
    userId: Joi.string().required(),
    field: Joi.string().valid(...allowedFields).optional(),
    value: Joi.any().optional()
});

router.get('/:model/:userId', async (req, res) => {
    try {
        const { error, value } = schema.validate({ ...req.params, ...req.query });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { model: modelName, userId, field, value: fieldValue } = value;
        const model = models[modelName];
        const query = { user: userId, status: { $ne: "deleted" } };

        if (field && fieldValue) {
            query[field] = fieldValue;
        }

        const result = await model.find(query).sort(sortFields[modelName]);

        if (fieldMappings[modelName]) {
            const mapping = fieldMappings[modelName];
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
