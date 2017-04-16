/* global logger */
'use strict'

const async = require('async')
const mongoose = require('mongoose')

exports.gracefulShutdown = (signals) => {
  _.forEach(signals, (signal) => {
    process.on(signal, function () {
      async.parallel({
        mongo: (cb) => {
          mongoose.connection.close(() => {
            logger.warn('Disconnecting from mongodb')
            return cb(null)
          })
        }
      }, () => {
        logger.info('Shutting down server')
        process.exit(0)
      })
    })
  })
}
