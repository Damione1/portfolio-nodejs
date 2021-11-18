const express = require('express')
const router = express.Router()
const WorkExperience = require('../models/workExperiences')


// @route   GET api/workExperiences
// @desc    Get all workExperiences
// @access  Public
router.get('/', async (req, res) => {
 try {
   const workExperiences = await WorkExperience.find()
   res.json(workExperiences)
 } catch (err) {
    res.status(500).json( {message: err.message} )
 }
})

router.get('/:id', getWorkExperiences, (req, res) => {
    res.json(workExperience)
})


router.post('/', (req, res) => {
  const newWorkExperience = new WorkExperience({
      company: req.body.company,
      position: req.body.position,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      user: req.body.user
  })
  try {
      newWorkExperience.save()
      res.status(201).json(newWorkExperience)
  } catch (err) {
      res.status(400).json( {message: err.message} )
  }
})


router.patch('/:id', getWorkExperiences, async (req, res) => {

  if (req.body.company != null) {
    res.workExperiences.company = req.body.company
  }
  if (req.body.position != null) {
    res.workExperiences.position = req.body.position
  }
  if (req.body.description != null) {
    res.workExperiences.description = req.body.description
  }
  if (req.body.startDate != null) {
    res.workExperiences.startDate = req.body.startDate
  }
  if (req.body.endDate != null) {
    res.workExperiences.endDate = req.body.endDate
  }
  if (req.body.user != null) {
    res.workExperiences.user = req.body.user
  }
  
  try {
    const updatedWorkExperience = await res.workExperiences.save()
    res.json(updatedWorkExperience)
  } catch (err) {
    res.status(400).json( {message: err.message} )
  }
  
  
})

router.delete('/:id', getWorkExperiences, async (req, res) => {

  try {
    await WorkExperience.remove()
    res.status(200).json( {message: 'WorkExperience deleted'} )
  } catch (err) {
    res.status(500).json( {message: err.message} )
  }
  
})


async function getWorkExperiences(req, res, next) {
  let workExperiences
  try {
    const workExperiences = await WorkExperience.findById( req.params.id )
    res.workExperiences = workExperiences
    if (null === workExperiences) {
      return res.status(404).json( {message: 'WorkExperience not found'} )
    }
  } catch (err) {
    res.status(500).json( {message: err.message} )
  }
  
  res.workExperiences = workExperiences
  next()
  
}


module.exports = router
