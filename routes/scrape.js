var express = require('express')
var request = require('request')
var cheerio = require('cheerio')
var status = require('http-status')

var router = express.Router()

var db = require('../db')
var scraper = require('../module/scraper')
var mongoose = require('mongoose')
var Jobs = mongoose.model('Job')

// CRUD for Jobs
router.get('/',function (req, res) {
    var url = "https://www.linkedin.com/jobs/view-all"
    request(url, function(err, resp, html){
            if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
            var rawJobs = scraper.getJobs(html)
        	console.log(rawJobs)
            //console.log("Raw JObs : "+JSON.stringify(rawJobs))
            
    })
  })

module.exports = router
