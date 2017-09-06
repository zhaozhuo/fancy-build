const redis = require('redis')
const config = require('../build/server.config.js')
const client = redis.createClient(config.redis)
module.exports = client
