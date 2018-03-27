const path = require('path')
const env = process.env.NODE_ENV

const upload = {
  temp: path.resolve(__dirname, '../upload.temp'),
  path: path.resolve(__dirname, '../upload'),
  url: '/upload',
}
const cookiePrefix = 'fb_'
const signExpire = 3600 * 2

const config = {
  development: {
    upload,
    cookiePrefix,
    signExpire,
  },
  production: {
    upload,
    cookiePrefix,
    signExpire,
  }
}

module.exports = config[env]
