const express = require('express')
const router = express.Router()
const WorkExperience = require('../models/workExperience')


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

router.get('/:id', getWorkExperience, (req, res) => {
    res.json(res.workExperience)
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


router.patch('/:id', getWorkExperience, async (req, res) => {

  if (req.body.company != null) {
    res.workExperience.company = req.body.company
  }
  if (req.body.position != null) {
    res.workExperience.position = req.body.position
  }
  if (req.body.description != null) {
    res.workExperience.description = req.body.description
  }
  if (req.body.startDate != null) {
    res.workExperience.startDate = req.body.startDate
  }
  if (req.body.endDate != null) {
    res.workExperience.endDate = req.body.endDate
  }
  if (req.body.current != null) {
    res.workExperience.current = req.body.current
  }
  if (req.body.user != null) {
    res.workExperience.user = req.body.user
  }
  if(req.body.language != null){
    res.workExperience.language = req.body.language
  }
  
  try {
    const updatedWorkExperience = await res.workExperience.save()
    res.json(updatedWorkExperience)
  } catch (err) {
    res.status(400).json( {message: err.message} )
  }
  
  
})

router.delete('/:id', getWorkExperience, async (req, res) => {

  try {
    await res.workExperience.remove()
    res.status(200).json( {message: 'WorkExperience deleted'} )
  } catch (err) {
    res.status(500).json( {message: err.message} )
  }
  
})


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


module.exports = router
