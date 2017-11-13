const DEBUG = process.env.NODE_ENV === 'development'
const path = require('path')
const log4js = require('log4js')
const root = path.resolve(__dirname, '../logs')

const logger = name => {
  let appenders = {
    console: {
      type: 'console'
    },
  }
  let categories = {
    default: {
      appenders: ['console'],
      level: 'info'
    },
  }

  appenders[name] = {
    type: 'dateFile',
    filename: `${root}/${name}`,
    pattern: '-yyyyMMdd.log',
    alwaysIncludePattern: true,
    maxLogSize: 1024,
  }
  categories[name] = {
    appenders: [name, 'console'],
    level: DEBUG ? 'debug' : 'warn',
  }

  log4js.configure({
    appenders,
    categories,
    replaceConsole: true,
  })
  return log4js.getLogger(name)
}
module.exports = logger
