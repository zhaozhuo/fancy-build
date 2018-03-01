const redis = require('redis')
const config = require('../config/server')
const client = redis.createClient(config.redis)
module.exports = client
