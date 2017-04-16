/* global logger */
'use strict'

const async = require('async')
const mongoose = require('mongoose')

exports.gracefulShutdown = (cron, signals) => {
  _.forEach(signals, (signal) => {
    process.on(signal, function () {
      async.parallel({
        mongo: (cb) => {
          mongoose.connection.close(() => {
            logger.warn('Disconnecting from mongodb')
            return cb(null)
          })
        },
        cron: (cb) => {
          cron.stop(() => {
            logger.warn('Stopping inkscraper cron')
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
