const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

global._ = require('lodash')

require('dotenv').config()

const setupApp = require('./app/setup/express')
const setupDB = require('./app/setup/mongodb')

setupDB(process.env.MONGOLAB_URI, mongoose)
setupApp(app, express)

app.listen(app.get('port'), function () {
  console.log('\n Hire Me server up, port : ' + app.get('port') + ' environment ' + app.get('env'))
})

module.exports = app
