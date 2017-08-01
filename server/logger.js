const env = process.env.NODE_ENV === 'development' ? 'dev' : 'pro'
const config = require('../build/server.config.js')[env]

module.exports = function(catetory){
  return config.logger(catetory)
}
