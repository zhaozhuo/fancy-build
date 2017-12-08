const path = require('path')
const env = process.env.NODE_ENV === 'development' ? 'dev' : 'pro'

const testStatus = {
  '1': 'test1',
  '2': 'test2',
  '3': 'test3',
}
const upload = {
  temp: path.resolve(__dirname, '../upload.temp'),
  path: path.resolve(__dirname, '../upload'),
  url: '/upload',
}
const cookiePrefix = 'fb_'
const signExpire = 3600 * 2

const config = {
  dev: {
    testStatus,
    upload,
    cookiePrefix,
    signExpire,
  },
  pro: {
    testStatus,
    upload,
    cookiePrefix,
    signExpire,
  }
}

module.exports = config[env]
