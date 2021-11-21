const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

const User = require('../models/user')
const Auth = require('../helpers/auth')

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email})
        
    if (null === user) {
      return res.status(400).json({message: 'User not found'})
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = await Auth.generateAccessToken(user)
      const refreshToken = await Auth.generateRefreshToken(user)
      res.status(200).json({'accessToken': accessToken, 'refreshToken': refreshToken})
    } else {
      res.status(400).json({message: 'Invalid password'})
    }

  } catch (err) {
    res.status(500).json({message: err.message})
  }
  
})



module.exports = router
