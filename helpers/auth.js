require('dotenv').config();
const jwt = require('jsonwebtoken')

async function generateAccessToken(user) {
  const accessToken = await jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
  return accessToken;
}

async function generateRefreshToken(user) {
  const refreshToken = await jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET)
  return refreshToken;
}

module.exports = {generateAccessToken, generateRefreshToken} 