const path = require('path')
const env = process.env.NODE_ENV

const config = require('./server.config.json')[env]
if (config.upload) {
  config.upload.temp = path.resolve(__dirname, `../${config.upload.temp}`)
  config.upload.path = path.resolve(__dirname, `../${config.upload.path}`)
}
module.exports = config
