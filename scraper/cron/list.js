'use strict'

const mongoose = require('mongoose')
const mgoJobs = mongoose.model('Job')
const axios = require('axios')
const scraper = require('../scraper')
const async = require('async')
const winston = require('winston')

exports.getAllJobs = (task, done) => {
	let config = {
    headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'}
  }
  let countJobs = task.counts
  let pages = _.range(0, countJobs / 25)
  let links = _.map(pages, (page) => {
      return `https://www.linkedin.com/jobs/search/?location=Indonesia&start=${page*25}`
  })
	async.each(links, (link, callback) => {
		axios
			.get(link, config)
			.then((response) => {
				let rawJobs = scraper.getJobs(response.data)
				let inserted = 0
				async.each(rawJobs, (job, cb) => {
					let query = {
            job_id: job.job_id,
            is_detail: false
          }
					let jobData = {
            job_id: job.job_id,
						job_name: job.job_name,
						company: job.company,
						logo: job.logo,
						ocation: job.location,
						description: job.description,
						detail_url: job.detail_url,
            is_detail: false
					}
					mgoJobs
						.findOne(query, 'job_id')
						.lean()
						.exec((err, job) => {
							if (err){
                logger.error(err)
                return cb(null)
              } else if (!job) {
                mgoJobs(jobData).save((err) => {
                  if (err) logger.error(err)
                  else inserted++
                  return cb(null)
                })
              } else {
                return cb(null)
              }
						})
				}, () => {
					logger.info('Inserted Jobs', inserted)
					return callback(null)
				})
			})
			.catch((response) => {
				if (response instanceof Error) {
						// Something happened in setting up the request that triggered an Error
						logger.error('Error', response.message)
				} else {
						logger.error('Status Code', response.status)
				}
				return callback(null)
			})
	}, () => {
		return done()
	})
}
