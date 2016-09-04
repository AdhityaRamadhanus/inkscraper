'use strict'

const mongoose = require('mongoose')
const Jobs = mongoose.model('Job')
const status = require('http-status')
const axios = require('axios')
const scraper = require('../libs/scraper')
const urlBuilder = require('../helpers/linkedin-url')
const async = require('async')

module.exports.insertJobs = (req, res, next) => {
  var url = req.query.url || 'http://www.linkedin.com/jobs/view-all'
  var config = {
    headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'}
  }
  axios.get(url, config)
    .then((response) => {
      var rawJobs = scraper.getJobs(response.data)
      if (rawJobs.length === 0) return res.json({message: 'Scraping Failed, Html not as expected'})
      return Jobs.insertMany(rawJobs) // Promise
    })
    .then((results) => {
      res.json({message: 'Scrape Done', inserted_count: results.length})
    })
    .catch((response) => {
      if (response instanceof Error) {
        // Something happened in setting up the request that triggered an Error
        return res.json({error: response.message})
      } else {
        // The request was made, but the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Status Code : ' + response.status)
        console.log('Response Headers ' + JSON.stringify(response.headers))
        return res.json({error: 'Status code not 200', status: response.status})
      }
    })
}

module.exports.updateJobs = (req, res, next) => {
  var url = req.query.url || 'https://www.linkedin.com/jobs/view-all'
  var config = {
    headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'}
  }
  axios.get(url, config)
    .then((response) => {
      var rawJobs = scraper.getJobs(response.data)
      if (rawJobs.length === 0) return res.json({message: 'Scraping Failed, Html not as expected'})
      var processed = 0
      async.each(rawJobs, function (job, callback) {
        var query = {job_id: job.job_id}
        var update = {
          $set: {
            'job_name': job.job_name,
            'company': job.company,
            'logo': job.logo,
            'location': job.location,
            'description': job.description
          }
        }
        var options = {upsert: true}
        Jobs
          .findOneAndUpdate(query, update, options)
          .lean()
          .exec((err) => {
            processed++
            console.log('Finished Insert Job ' + job.job_id + ' processed ' + processed)
            if (err) callback(err)
            else callback()
          })
      }, (err) => {
        if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
        return res.json({message: 'Scrape Done', upserted_count: rawJobs.length})
      })
    })
    .catch(function (response) {
      if (response instanceof Error) {
        // Something happened in setting up the request that triggered an Error
        return res.json({error: response.message})
      } else {
        // The request was made, but the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Status Code : ' + response.status)
        console.log('Response Headers ' + JSON.stringify(response.headers))
        return res.json({error: 'Status code not 200', status: response.status})
      }
    })
}

module.exports.getJobDetails = (req, res, next) => {
  async.waterfall([
    (callback) => {
      Jobs.
        find({is_detail: false}, 'job_id')
        .exec((err, jobs) => {
          callback(err, jobs)
        })
    },
    (jobs, callback) => {
      var processed = 0
      async.each(jobs, (job, cb) => {
        var url = urlBuilder.buildDetailUrl(job.job_id)
        console.log('Scraping ' + url)
        var config = {
          headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'}
        }
        axios
          .get(url, config)
          .then((response) => {
            // var specificJobs = scraper.getJobDetails(response.data)
            var specificJobs = null
            if (specificJobs != null) {
              var query = {job_id: specificJobs.job_id}
              var update = {$set: {'other_details': specificJobs.other_details, 'is_detail': true}}
              Jobs
                .findOneAndUpdate(query, update)
                .exec((err, job) => {
                  processed++
                  console.log('Finished Insert Job ' + job.job_id + ' processed ' + processed)
                  cb(err)
                })
            } else {
              cb(new Error('Failed to Scrape Details'))
            }
          })
      }, (err) => callback(err, jobs.length))
    }], (err, results) => {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      res.json({message: 'Scraping Detail Done', updated_jobs: results})
    })
}
