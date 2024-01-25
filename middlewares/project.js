const Project = require('../models/project')
const Joi = require('joi')

async function getProject(req, res, next) {
    const { error } = idValidationSchema.validate(req.params)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    try {
        const project = await Project.findById(req.params.id).populate('images', '-user -date -__v');
        if (project == null) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.project = project;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

const idValidationSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})
const projectValidationSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    link: Joi.string().uri().required(),
    tags: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string()),
    language: Joi.string(),
    excerpt: Joi.string()
})


module.exports = { getProject, idValidationSchema, projectValidationSchema }
