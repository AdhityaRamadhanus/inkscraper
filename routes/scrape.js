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
router.get('/', function (req, res) {
  var url = 'https://www.linkedin.com/jobs/view-all'
  request(url, function (err, resp, html) {
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    if (resp.statusCode === 404 || resp.statusCode === 500) return res.status(resp.statusCode).send('Error ' + resp.statusCode)
    var rawJobs = scraper.getJobs(html)
    Jobs.collection.insert(rawJobs, {}, function (err, jobs) {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      res.send('Jobs Parsed')
    })
  })
})

module.exports = router
