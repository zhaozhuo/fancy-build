const redis = require('redis')
const env = process.env.NODE_ENV === 'development' ? 'dev' : 'pro'
const config = require('../build/server.config.js')[env]
const client = redis.createClient(config.redis)

module.exports = client
