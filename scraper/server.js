'use strict'

const graceful = require('./graceful')
const agenda = require('agenda')
const agendash = require('agendash')
const express = require('express')
const mongoose = require('mongoose')
const winston = require('winston');
const db = require('./db')
const app = express()
const config = require('./config')

// Dangerous
global._ = require('lodash')
global.logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
				timestamp:true,
				colorize: true
			})
    ]
})

db.connectMongo(config.DB.URI, (err) => {
	if (err) {
		logger.error(err)
		process.exit(1)
	}

	const cron = new agenda({
		db: {
			address: config.DB.URI,
			collection: 'cron'
		}
	})

	const cronTask = require('./cron')
	cron
		.on('ready', job => {
			// Cancelling any running job
			cron.cancel({}, (err, numRemoved) => {
				if (err) logger.error(err)
				cronTask(cron)
				cron.start()
			})
		})
		.on('start', job => {
			logger.profile(job.attrs.name)
			logger.info(job.attrs.name, 'Started')
		})
		.on('success', job => {
			logger.profile(job.attrs.name, job.attrs.name + ' Done')
		})
		.on('fail', (err, job) => {
			logger.error(job.attrs.name, 'Failed', err)
		})

	graceful.gracefulShutdown(cron, ['SIGTERM', 'SIGINT', 'SIGHUP'])

	app.use('/', agendash(cron))
	app.listen(9008)
})
