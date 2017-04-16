'use strict'
const redis = require('redis')
const config = require('./config')

var redisClient = redis.createClient({
  host: config.REDIS.URI,
  port: config.REDIS.PORT,
  db: 0,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return new Error('Retry 10 times')
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  }
})

exports.get = (key, callback) => {
  redisClient.get(key, (err, response) => {
    if (!err && response) {
      let data = JSON.parse(response)
      callback(data)
    } else {
      callback(null)
    }
  })
}

exports.set = (key, data) => {
  redisClient.set(key, JSON.stringify(data))
}

exports.setex = (key, ttl, data) => {
  redisClient.setex(key, ttl, JSON.stringify(data))
}

exports.del = (key) => {
  redisClient.del(key, (err, res) => {
    if (err) console.error(err)
  })
}
