'use strict'
// standard test : PASSED
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var apiRoutes = require('./routes/api')
var scrapeRoutes = require('./routes/scraper')

module.exports = function (app, express) {
  // app var
  app.set('port', process.env.PORT || 3000)
  app.set('env', process.env.NODE_ENV || 'development')

  // Middlewares setup
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(express.static(path.join(__dirname, 'public')))

  // App Routes
  // app.use('/', express.static(path.join(__dirname, '/apidoc')))
  app.use('/scrape', scrapeRoutes)
  app.use('/api', apiRoutes)
}
