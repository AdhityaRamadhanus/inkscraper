'use strict'

const config = {
  DB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/inkscraper'
  }
}

module.exports = config
