const path = require('path')
const log4js = require('log4js')
const root = path.resolve(__dirname, '../')
const env = process.env.NODE_ENV === 'development' ? 'dev' : 'pro'
const debug = env === 'dev'
// http://qianduan.guru/2016/08/21/nodejs-lesson-1-log4js/
// const levels = {
//   trace: log4js.levels.TRACE,
//   debug: log4js.levels.DEBUG,
//   info: log4js.levels.INFO,
//   warn: log4js.levels.WARN,
//   error: log4js.levels.ERROR,
//   fatal: log4js.levels.FATAL,
// }
log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    access: {
      type: 'dateFile',
      filename: `${root}/logs/access`,
      pattern: '.yyyyMMdd.log',
      alwaysIncludePattern: true,
      maxLogSize: 1024,
      // backups: 1,
    },
    sql: {
      type: 'dateFile',
      filename: `${root}/logs/sql`,
      pattern: '.yyyyMMdd.log',
      alwaysIncludePattern: true,
      maxLogSize: 1024,
    },
    script: {
      type: 'dateFile',
      filename: `${root}/logs/script`,
      pattern: '.yyyyMMdd.log',
      alwaysIncludePattern: true,
      maxLogSize: 1024,
    },
  },
  categories: {
    default: {
      appenders: ['access'],
      level: 'info'
    },
    sql: {
      appenders: ['sql', 'console'],
      level: debug ? 'debug' : 'warn',
    },
    script: {
      appenders: ['script', 'console'],
      level: debug ? 'debug' : 'warn',
    }
  },
  replaceConsole: true,
});

const logger = category => log4js.getLogger(category);
const config = {
  dev: {
    logger,
    port: 5151,
    jsonpCallback: 'callback',
    mysql: {
      host: 'localhost',
      port: 3306,
      database: 'myapp',
      username: 'root',
      password: 'abc123123',
      prefix: 'fb_',
    },
    https: {
      port: 5252,
      key: `${root}/cert/private.key`,
      cert: `${root}/cert/cert.crt`,
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
    },
  },
  pro: {
    logger,
    port: 8181,
    jsonpCallback: 'callback',
    mysql: {
      host: 'localhost',
      port: 3306,
      database: 'myapp',
      username: 'root',
      password: 'abc123123123123123',
      prefix: 'fb_',
    },
    https: {
      port: 8282,
      key: `${root}/cert/private.key`,
      cert: `${root}/cert/cert.crt`,
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
    },
  },
}

module.exports = config[env]
