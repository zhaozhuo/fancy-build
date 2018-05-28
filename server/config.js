const configServer = require('../config/server')
const env = process.env.NODE_ENV

const cookiePrefix = 'fancy_'
const upload = configServer.upload
const signExpire = 3600 * 2

const config = {
  development: {
    upload,
    cookiePrefix,
    signExpire,
  },
  testing: {
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
