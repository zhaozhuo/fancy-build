const mysql = require('mysql')
const config = require('../build/server.config')
const pool = mysql.createPool({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database,
  dateStrings: 'datetime',
})

module.exports = {
  pool,
  prefix: 'fb_',
}
