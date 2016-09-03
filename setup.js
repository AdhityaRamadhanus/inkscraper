'use strict'
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const loader = require('./helpers/loader').loadRoute

module.exports = (app, express) => {
  // app var
  app.set('port', process.env.PORT || 3000)
  app.set('env', process.env.NODE_ENV || 'development')

  // Middlewares setup
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // App Routes
  // app.use('/', express.static(path.join(__dirname, '/apidoc')))
  loader(path.join(__dirname, 'routes'), app)
}
