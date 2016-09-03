'use strict'
// standard test : PASSED
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var apiRoutes = require('./routes/api')
var scrapeRoutes = require('./routes/scrape')

module.exports = function (app, express) {
  // app var
  app.set('port', process.env.PORT || 3000)
  app.set('env', process.env.NODE_ENV || 'development')

  // view engine setup
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'jade')
  // Middlewares setup
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(express.static(path.join(__dirname, 'public')))

  // App Routes
  app.use('/', express.static(path.join(__dirname, '/apidoc')))
  app.use('/scrape', scrapeRoutes)
  app.use('/api', apiRoutes)

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // error handlers
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500)
      res.render('error', {
        message: err.message,
        error: err
      })
    })
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })
}
