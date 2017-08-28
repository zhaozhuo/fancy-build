const Sequelize = require('sequelize')

const env = process.env.NODE_ENV === 'development' ? 'dev' : 'pro'
const config = require('../build/server.config')[env]
const logger = require('./logger')('sql')
const mydb   = config.mysql

const db = new Sequelize(mydb.database, mydb.username, mydb.password, {
  host: mydb.host,
  port: mydb.port,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  Sequelize,
  prefix: mydb.prefix,
  logging: sql => logger.info(sql),
})

function ApplicationMysql() {
  return db
}
module.exports = new ApplicationMysql()

// Sequelize 和 MySQL 对照
// https://segmentfault.com/a/1190000003987871
// https://itbilu.com/nodejs/npm/V1PExztfb.html

// ORM VS
// Comparing bookshelf vs. objection vs. orm vs. sequelize vs. sql-bricks
// https://npmcompare.com/compare/bookshelf,objection,orm,sequelize,sql-bricks

// logger VS
// Comparing bunyan vs. log4js vs. morgan vs. scribe vs. winston
// https://npmcompare.com/compare/bunyan,log4js,morgan,scribe,winston
