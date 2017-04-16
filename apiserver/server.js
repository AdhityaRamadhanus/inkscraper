/* global logger */
'use strict'

require('dotenv').config()
const config = require('./config')
const express = require('express')
const winston = require('winston')
const graceful = require('./graceful')
const app = express()

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

// Dangerous
global._ = require('lodash')
global.logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: false
})
logger.stream = {
  write: (message, encoding) => {
    logger.info(message)
  }
}

const setupApp = require('./setup/express')
const setupDB = require('./setup/mongodb')

setupDB(config.DB.URI)
setupApp(app, express)

app.listen(app.get('port'), () => {
  logger.info('inkscraper api server up, port : ' + app.get('port') + ' environment ' + app.get('env'))
})

graceful.gracefulShutdown(['SIGTERM', 'SIGINT', 'SIGHUP'])

module.exports = app
