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
  /*request(url, function (err, resp, html) {
    // error when sending request
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    // linkedin response with error
    if (resp.statusCode === 404 || resp.statusCode === 500) return res.status(resp.statusCode).send('Error ' + resp.statusCode)
    var rawJobs = scraper.getJobs(html)
    if (rawJobs.length === 0) return res.send('Scraping Failed')
    Jobs.collection.insert(rawJobs, {ordered: false}, function (err, result) {
      if (err) console.error(err)
      if (!result) return res.status(status.INTERNAL_SERVER_ERROR).send('Write Operation failed, check log')
      if (rawJobs.length === result.insertedCount) {
        return res.send('Scrape Done ,' + result.insertedCount + ' Inserted')
      } else {
        console.log(result)
        return res.send('Some of write operation failed, check log ' + result.insertedCount + ' Inserted')
      }
    })
  })*/
})
// Upsert operation, every jobs (if any) will be upserted, this operation is slower than bulk insert, this is for sync
router.get('/update', function (req, res) {
  var url = req.query.url || 'https://www.linkedin.com/jobs/view-all'
  request(url, function (err, resp, html) {
    // error when sending request
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    // linkedin response with error
    if (resp.statusCode === 404 || resp.statusCode === 500) return res.status(resp.statusCode).send('Error ' + resp.statusCode)
    var rawJobs = scraper.getJobs(html)
    if (rawJobs.length === 0) return res.send('Scraping Failed')
    rawJobs.forEach(function (job) {
      Jobs.findOneAndUpdate(
        {job_id: job.job_id},
        job,
        {upsert: true},
        function (err) {
          // Ignore Error
          if (err) console.error(err)
        })
    })
    res.send('Scrape Done ,' + rawJobs.length + ' Upserted')
  })
})

router.get('/details', function (req, res) {
  Jobs.find({other_details: null}, 'job_id', function (err, jobs) {
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    var processed = 0
    var jobQueue = async.queue(function (job, callback) {
      var url = urlBuilder.buildDetailUrl(job.job_id)
      request(url, function (err, resp, html) {
        if (err) console.error('Scraping ' + job.job_id + ' got error ' + err.toString())
        if (resp.statusCode === 404 || resp.statusCode === 500) console.error('Scraping ' + job.job_id + ' got error ' + resp.statusCode)
        var details = scraper.getJobDetails(html)
        job.other_details = details
        job.save(function (err, job) {
          if (err) console.error('Updating ' + job.job_id + ' got error ' + err.toString())
          processed++
          callback()
        })
      })
    }, 2)

    jobQueue.drain = function () {
      res.send('Scraping Detail Done , ' + processed + ' Updated')
    }
    jobQueue.push(jobs, function (err) {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      console.log('Finished Updating Job Details')
    })
  })
})
module.exports = router
