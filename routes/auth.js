const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

const User = require('../models/user')



router.post('/login', async (req, res) => {
  
  const user = User.find({"User.email": req.body.email})
  console.log(user.password)
  console.log(req.body.email)
  if (null === user) {
    return res.status(400).json({message: 'User not found'})
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).json({message: 'Success'})
    } else {
      res.status(400).json({message: 'Invalid password'})
    }
  } catch (err) {
    res.status(500).json({message: err.message})
  }
  
})



module.exports = router
