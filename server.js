var express = require('express')
var app = express()

var mongoose = require('mongoose')
require('./db')(process.env.MONGOLAB_URI, mongoose)
require('./models/Jobs')

require('./setup')(app, express)

app.listen(app.get('port'), function () {
  console.log('\n Hire Me server up, port : ' + app.get('port') + ' environment ' + app.get('env'))
})

module.exports = app
