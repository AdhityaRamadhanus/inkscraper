'use strict'

require('dotenv').config()
const config = require('./config')
const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

// Dangerous
global._ = require('lodash')

const setupApp = require('./setup/express')
const setupDB = require('./setup/mongodb')

setupDB(config.DB.URI, mongoose)
setupApp(app, express)

app.listen(app.get('port'), function () {
  console.log('\n Hire Me server up, port : ' + app.get('port') + ' environment ' + app.get('env'))
})

module.exports = app
