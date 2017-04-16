/* global logger */
'use strict'

const mongoose = require('mongoose')
const mgoJobs = mongoose.model('Job')
const axios = require('axios')
const scraper = require('../scraper')
const async = require('async')

exports.getDetailJobs = (task, done) => {
  async.waterfall([
    (callback) => {
      let query = {
        is_detail: false
      }
      mgoJobs
        .find(query, 'job_id detail_url')
        .limit(10)
        .exec(callback)
    },
    (jobs, callback) => {
      let updated = 0
      async.each(jobs, (job, cb) => {
        let url = job.detail_url
        let config = {
          headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'}
        }
        axios
          .get(url, config)
          .then((response) => {
            let specificJobs = scraper.getJobDetails(response.data)
            if (specificJobs) {
              let query = {
                job_id: specificJobs.job_id
              }
              let updateData = {
                other_details: specificJobs.other_details,
                is_detail: true
              }
              mgoJobs
                .findOneAndUpdate(query, updateData)
                .exec((err) => {
                  if (err) logger.error(err)
                  else updated++
                  return cb(null)
                })
            } else {
              return cb('Failed to get details')
            }
          })
          .catch((response) => {
            if (response instanceof Error) {
              // Something happened in setting up the request that triggered an Error
              logger.error('Error', response.message)
            } else {
              logger.error('Status Code', response.status)
            }
            return cb(null)
          })
      }, () => {
        logger.info('Updated job details', updated)
        return callback(null)
      })
    }
  ], () => {
    return done()
  })
}
