const Project = require('../models/project')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)


async function getProject(req, res, next) {
    const { error } = idValidationSchema.validate(req.params)
    if (error) {
        console.log("validation error", error)
        return res.status(400).json({ message: JSON.stringify(error.details) });
    }

    try {
        const project = await Project.findById(req.params.id).populate('images', '-user -date -__v');
        if (project == null) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.project = project;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const idValidationSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})


const projectValidationSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.object({ _id: Joi.objectId().required() })).optional(),
    excerpt: Joi.string().optional().allow(''),
    user: Joi.optional(),
    language: Joi.optional(),
    slug: Joi.optional(),
    _id: Joi.optional(),
})


module.exports = { getProject, idValidationSchema, projectValidationSchema }
