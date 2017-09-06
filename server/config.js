const path = require('path')
const env = process.env.NODE_ENV === 'development' ? 'dev' : 'pro'

const testStatus = {
  "1": 'test1',
  "2": 'test2',
  "3": 'test3',
}

const config = {
  dev: {
    testStatus,
    upload: {
      temp: path.resolve(__dirname, '../upload.temp'),
      path: path.resolve(__dirname, '../upload'),
      url: '/upload',
    },
  },
  pro: {
    testStatus,
    upload: {
      temp: path.resolve(__dirname, '../upload.temp'),
      path: path.resolve(__dirname, '../upload'),
      url: '/upload',
    },
  }
}

module.exports = config[env]
