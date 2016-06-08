// Standart Test :PASSED
/* node module dependencies */
var express = require('express')
var request = require('request')
var axios = require('axios')
var status = require('http-status')
var scraper = require('../module/scraper')
var urlBuilder = require('../helper/linkedin-url')
var async = require('async')
var router = express.Router()
/* Load Model */
var mongoose = require('mongoose')
var Jobs = mongoose.model('Job')
// Scraping Endpoint
// Insert operation, every jobs (if any) will be inserted using bulk insert operation
router.get('/insert', function (req, res) {
  var url = req.query.url || 'http://www.linkedin.com/jobs/view-all'
  var config = {
    headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'}
  }
  axios.get(url,config)
    .then(function (response) {
      //console.log(response.data)
      var rawJobs = scraper.getJobs(response.data)
      if (rawJobs.length === 0) return res.json({message: 'Scraping Failed, Html not as expected'})
      var Promise = Jobs.insertMany(rawJobs)
      Promise
        .then(function (results) {
          return res.json({message: 'Scrape Done', inserted_count: results.insertedCount})
        })
        .catch(function (err) {
          return res.json({message: 'Write Operation Failed', error: err.errmsg})
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
        console.log('Response Headers '+JSON.stringify(response.headers))
        return res.json({error: 'Status code not 200', status: response.status})
      }
    })
})
// Upsert operation, every jobs (if any) will be upserted, this operation is slower than bulk insert, this is for sync
router.get('/update', function (req, res) {
  var url = req.query.url || 'https://www.linkedin.com/jobs/view-all'
  var config = {
    headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'}
  }
  axios.get(url,config)
    .then(function (response) {
      //console.log(response.data)
      var rawJobs = scraper.getJobs(response.data)
      if (rawJobs.length === 0) return res.json({message: 'Scraping Failed, Html not as expected'})
      var jobQueue = async.queue(function (job, callback) {
        var query = {job_id: job.job_id}
        var update = {
          $set:
            {
              "job_name": job.job_name,
              "company": job.company,
              "logo": job.logo,
              "location": job.location,
              "description": job.description
            }
          }
        var options = {upsert: true}
        var Promise = Jobs.findOneAndUpdate(query,update,options).exec()
        Promise
          .then(function () {
            callback()
          })
          .catch(function (err) {
            console.log(err)
          })
      })
      jobQueue.drain = function () {
        return res.json({message: 'Scrape Done', upserted_count: rawJobs.length})
      }
      jobQueue.push(rawJobs, function (err) {
        if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
        console.log('Finished Insert Job')
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
        console.log('Response Headers '+JSON.stringify(response.headers))
        return res.json({error: 'Status code not 200', status: response.status})
      }
    })
})

router.get('/details', function (req, res) {
  // Only take the non scraped jobs details
  var Promise = Jobs.find({other_details: null}, 'job_id').exec()
  Promise
    .then(function (jobs) {
      var axiosGets = jobs.map(function (job) {
        var url = urlBuilder.buildDetailUrl(job.job_id)
        var config = {
          headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'}
        }
        return axios.get(url,config)
      })
      return axiosGets
    })
    .then(function (axiosGets) {
      axios.all(axiosGets)
        .then(axios.spread(function () {
          var Responses = Array.prototype.slice.call(arguments)
          Responses.forEach(function (response) {
            var specificJobs = scraper.getJobDetails(response.data)
            if (specificJobs != null) {
              var query = {job_id: specificJobs.job_id}
              var update = {$set: {'other_details': specificJobs.other_details}}
              var Promise = Jobs.findOneAndUpdate(query,update).exec()
              Promise
                .then(function () {
                  console.log('Done Updating Jobs Detals')
                })
                .catch(function (err) {
                  console.log(err)
                })
            }
          })
          return res.json({message: 'Scraping Detail Done',updated_jobs: Responses.length})
        }))
        .catch(function (response) {
          if (response instanceof Error) {
            // Something happened in setting up the request that triggered an Error
            return res.json({error: response.message})
          } else {
            // The request was made, but the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Status Code : ' + response.status)
            console.log('Response Headers '+JSON.stringify(response.headers))
            return res.json({error: 'Status code not 200', status: response.status})
          }
        })
    })
    .catch(function (err) {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    })
})
module.exports = router
