const path = require('path')
const env = process.env.NODE_ENV === 'development' ? 'dev' : 'pro'

const upload = {
  temp: path.resolve(__dirname, '../upload.temp'),
  path: path.resolve(__dirname, '../upload'),
  url: '/upload',
}
const cookiePrefix = 'fb_'
const signExpire = 3600 * 2

const config = {
  dev: {
    upload,
    cookiePrefix,
    signExpire,
  },
  pro: {
    upload,
    cookiePrefix,
    signExpire,
  }
}

module.exports = config[env]
