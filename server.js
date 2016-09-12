const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

global._ = require('lodash')

require('dotenv').config()
require('./db')(process.env.MONGOLAB_URI, mongoose)
require('./models/Jobs')

require('./setup')(app, express)

app.listen(app.get('port'), function () {
  console.log('\n Hire Me server up, port : ' + app.get('port') + ' environment ' + app.get('env'))
})

module.exports = app
