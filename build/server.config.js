const path = require('path')
const log4js = require('log4js')
const root = path.resolve(__dirname, '../')

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
      level: 'info'
    },
    script: {
      appenders: ['script', 'console'],
      level: 'info'
    }
  },
  replaceConsole: true,
});

const logger = category => log4js.getLogger(category);

module.exports = {
  dev: {
    logger,
    port: 5151,
    jsonpCallback: 'callback',
    uploadDir: 'wefwe',
    mysql: {
      host: 'localhost',
      port: 3306,
      database: 'myapp',
      username: 'root',
      password: 'root',
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
    uploadDir: 'wefwe',
    mysql: {
      host: 'localhost',
      port: 3306,
      database: 'myapp',
      username: 'root',
      password: 'root',
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
