/* global logger */
'use strict'
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

module.exports = (dbURI) => {
  mongoose.connect(dbURI)
  // Connected
  mongoose.connection
    .on('connected', () => {
      logger.info('Connected to MongoDB')
    })
    .on('error', (err) => {
      logger.error('Failed to connect to Mongodb', err)
    })
  require('../../models/Jobs')
}
