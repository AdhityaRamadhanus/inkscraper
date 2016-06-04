// Standart Test :PASSED
/* node module dependencies */
var express = require('express')
var request = require('request')
var status = require('http-status')
var scraper = require('../module/scraper')
var router = express.Router()
/* Load Model */
var mongoose = require('mongoose')
var Jobs = mongoose.model('Job')
// Scraping Endpoint
// Insert operation, every jobs (if any) will be inserted using bulk insert operation
router.get('/insert', function (req, res) {
  var url = req.query.url || 'http://www.linkedin.com/jobs/view-all'
  var headers = { 
    User-Agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36' 
  };
  request({url: url, headers: headers}, function (err, resp, html) {
    console.log('Response Status : ' + resp.statusCode + '\n' + html)
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
  })
})
// Upsert operation, every jobs (if any) will be upserted, this operation is slower than bulk insert, this is for sync
router.get('/update', function (req, res) {
  var url = req.query.url || 'https://www.linkedin.com/jobs/view-all'
  console.log(url)
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
module.exports = router
