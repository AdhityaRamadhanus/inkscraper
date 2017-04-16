'use strict'

const config = {
  DB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/inkscraper'
  },
  APIDOC: process.env.APIDOC === 'true',
  REDIS: {
    URI: process.env.REDIS_URI || 'localhost',
    PORT: process.env.REDIS_PORT || 6379
  }
}

module.exports = config
