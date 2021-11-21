const WorkExperience = require('../models/workExperience')

async function getWorkExperience(req, res, next) {
  let workExperience
  try {
    workExperience = await WorkExperience.findById( req.params.id )
    if (null === workExperience) {
      return res.status(404).json( {message: 'WorkExperience not found'} )
    }
  } catch (err) {
    return res.status(500).json( {message: err.message} )
  }
  
  res.workExperience = workExperience
  next()
  
}

module.exports = { getWorkExperience }