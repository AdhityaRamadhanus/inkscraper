/* global logger */
'use strict'
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

exports.connectMongo = (dbURI, callback) => {
  mongoose.connect(dbURI)
  // Connected
  mongoose.connection
    .on('connected', () => {
      require('../models/Jobs')
      logger.info('Connected to MongoDB')
      callback(null)
    })
    .on('error', (err) => {
      logger.error('Failed to connect to Mongodb', err)
      callback(err)
    })
}
