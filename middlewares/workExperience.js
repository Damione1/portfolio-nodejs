const WorkExperience = require('../models/workExperience')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

async function getWorkExperience(req, res, next) {
  const { error } = idValidationSchema.validate(req.params)
  if (error) {
    console.log("validation error", error)
    return res.status(400).json({ message: JSON.stringify(error.details) });
  }
  try {
    const workExperience = await WorkExperience.findById(req.params.id);
    if (workExperience == null) {
      return res.status(404).json({ message: 'WorkExperience not found' });
    }
    res.workExperience = workExperience
    next()
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
}

const idValidationSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

const workExperienceValidationSchema = Joi.object({
  _id: Joi.objectId().optional(),
  title: Joi.string().required(),
  subTitle: Joi.string().required(),
  startDate: Joi.date().required(),
  current: Joi.boolean().required(),
  endDate: Joi.date().when('current', { is: false, then: Joi.required() }).allow(""),
  description: Joi.string().required(),
  user: Joi.objectId().optional(),
  language: Joi.string().optional().valid('en', 'fr'),
  status: Joi.string().optional().valid('published', 'draft', 'deleted'),
})


module.exports = { getWorkExperience, workExperienceValidationSchema }
