require('dotenv').config();
const jwt = require('jsonwebtoken')

async function generateAccessToken(user, expiresIn) {
  const accessToken = await jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn })
  return accessToken;
}

async function generateRefreshToken(user) {
  const refreshToken = await jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET)
  return refreshToken;
}

async function verifyAccessToken(accessToken) {
  try {
    const payload = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    return payload;
  } catch (err) {
    return false;
  }
}

async function verifyRefreshToken(refreshToken) {
  try {
    const payload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    return payload;
  } catch (err) {
    return false;
  }
}

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken }
