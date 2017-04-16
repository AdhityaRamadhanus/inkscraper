/* global logger */

'use strict'
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const loader = require('../helpers/loader').loadRoute
const config = require('../config')
const compression = require('compression')

module.exports = (app, express) => {
  // app var
  app.set('port', process.env.PORT || 3000)
  app.set('env', process.env.NODE_ENV || 'development')

  // Middlewares setup
  app.use(morgan('tiny', { 'stream': logger.stream }))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(compression())

  // App Routes
  if (config.APIDOC) {
    app.use('/apidoc', express.static(path.join(__dirname, '../../apidoc')))
  }
  loader(path.join(__dirname, '..', 'routes'), app)
}
