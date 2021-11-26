const bcrypt = require('bcrypt');
const express = require('express')

const router = express.Router()

const userSchema = require('../models/user')

const { authenticateToken } = require('../middlewares/auth')
const { getUser } = require('../middlewares/users')

// @route   GET api/workExperiences
// @desc    Get all workExperiences
// @access  Public
router.get('/', async (req, res) => {
 try {
   const workExperiences = await userSchema.find()
   res.json(workExperiences)
 } catch (err) {
    res.status(500).json( {message: err.message} )
 }
})

router.get('/:id', getUser, (req, res) => {
    res.json(res.workExperience)
})


router.post('/', authenticateToken, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await new userSchema({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword
    })
    await newUser.save()
    res.status(201).json(newUser)
  }catch (err) {
    return res.status(500).json( {message: err.message} )
  }
})


router.patch('/:id', authenticateToken, getUser, async (req, res) => {

  if (req.body.firstName != null) {
    res.user.firstName = req.body.firstName
  }
  if (req.body.lastName != null) {
    res.user.lastName = req.body.lastName
  }
  if (req.body.email != null) {
    res.user.email = req.body.email
  }

  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json( {message: err.message} )
  }
  
  
})

router.delete('/:id', authenticateToken, getUser, async (req, res) => {

  try {
    await res.user.remove()
    res.status(200).json( {message: 'User deleted'} )
  } catch (err) {
    res.status(500).json( {message: err.message} )
  }
  
})


module.exports = router
