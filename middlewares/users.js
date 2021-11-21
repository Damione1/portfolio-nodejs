const User = require('../models/user')

async function getUser(req, res, next) {
  let user
  try {
    user = await User.findById( req.params.id )
    if (null === user) {
      return res.status(404).json( {message: 'User not found'} )
    }
  } catch (err) {
    return res.status(500).json( {message: err.message} )
  }
  
  res.user = user
  next()
  
}
module.exports = { getUser }