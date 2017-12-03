const fs = require('fs')
const path = require('path')
const log4js = require('log4js')

const root = path.resolve(__dirname, '../logs')
const DEBUG = process.env.NODE_ENV === 'development'

const appenders = {
  console: {
    type: 'console'
  },
  Model: {
    type: 'dateFile',
    filename: `${root}/Model`,
    pattern: '.yyyyMMdd.log',
    alwaysIncludePattern: true,
    maxLogSize: 1024,
  },
}
const categories = {
  default: {
    appenders: ['console'],
    level: 'info'
  },
  Model: {
    appenders: ['Model', 'console'],
    level: DEBUG ? 'debug' : 'warn',
  }
}

// Controllers
let pa = fs.readdirSync(path.resolve(__dirname, './Controller'));
pa.forEach((ele, index) => {
  let name = path.basename(ele, '.js')
  appenders[name] = {
    type: 'dateFile',
    filename: `${root}/${name}`,
    pattern: '.yyyyMMdd.log',
    alwaysIncludePattern: true,
    maxLogSize: 1024,
  }
  categories[name] = {
    appenders: [name, 'console'],
    level: DEBUG ? 'debug' : 'warn',
  }
})

log4js.configure({
  appenders,
  categories,
  replaceConsole: true,
})

module.exports = name => log4js.getLogger(name)
