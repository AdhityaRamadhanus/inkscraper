/* node module dependencies */
var express = require('express')
var router = express.Router()
var status = require('http-status')
var apicache = require('apicache')
var cache = apicache.options({debug: true}).middleware
/* var request = require('request')
var scraper = require('../module/scraper')
var urlBuilder = require('../helper/linkedin-url')*/
/* Load Model */
var mongoose = require('mongoose')
var Jobs = mongoose.model('Job')

// CRUD for Jobs
router.route('/jobs')
  /**
  * @api {get} api/jobs Request all jobs
  * @apiName GetJobs
  * @apiGroup Jobs
  * @apiSuccess {json} jobs 'All jobs information (job_id job_name company location)'
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {"results":[
          {"_id":"5752e350cf6a694c1c5cf622",
          "job_id":"140796356",
          "job_name":"Event Planner",
          "company":"Yanbal International",
          "location":"Deerfield Beach, Florida"}
        ]}
  */
  .get(cache('10 minutes'), function (req, res) {
    req.apicacheGroup = 'JobList'
    Jobs.find({}, 'job_id job_name company location', function (err, jobs) {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      res.json({results: jobs})
    })
  })
  /**
  * @api {post} api/jobs Create new Job
  * @apiName PostJobs
  * @apiGroup Jobs
  * @apiParam {String} job_id this must be unique, scraped job would use linkedin id
  * @apiParam {String} job_name Job title/name
  * @apiParam {String} company Company Name
  * @apiParam {String} logo Logo Image URI
  * @apiParam {String} location Job Location
  * @apiParam {String} description Job description
  * @apiParam {Object} other_details Job Details, it's an object you can insert any details you need
  * @apiSuccess {String} message message containing "Job Successfully Created!"
  * @apiSuccess {Object} job Job Object that just created
  * @apiParamExample {json} Request-Example:
    {
      job_id: "Test100",
      job_name: "Software Engineer",
      company: "UrbanHire",
      logo: "mylogo",
      location: "Jakarta",
      description: "NodeJs Engineer"
    }
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
          "message": "Job Successfully Created!",
          "job":
            {
              "__v": 0,
              "job_id": "Test100",
              "job_name": "Software Engineer",
              "company": "UrbanHire",
              "logo": "mylogo",
              "location": "Jakarta",
              "description": "NodeJs Engineer",
              "_id": "575410d2c88171681f21c053"
            }
        }
  */
  .post(function (req, res) {
    // Keep it simple haha
    Jobs(req.body).save()
      .then(function (job) {
        // Basically just trying to invalidate the cache
        apicache.clear('JobList')
        return res.status(201).json({message: 'Job Successfully Created!', job: job})
      })
      .catch(function (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      })
  })
  /**
  * @api {delete} api/jobs Delete all jobs
  * @apiName DeleteJobs
  * @apiGroup Jobs
  * @apiSuccess {String} message 'All Job Successfully Deleted!'
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {"message": "All Job Successfully Deleted!"}
  */
  .delete(function (req, res) {
    Jobs.remove({}, function (err) {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      // Basically just trying to invalidate the cache
      apicache.clear('JobList')
      res.status(201).json({message: 'All Job Successfully Deleted!'})
    })
  })

router.route('/jobs/:job_id')
  /**
  * @api {get} api/jobs/:job_id Request specific job information
  * @apiName GetJob
  * @apiGroup Jobs
  * @apiSuccess {Object} job All information about a job
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
        "job": {
          "_id": "5752e350cf6a694c1c5cf622",
          "job_id": "140796356",
          "job_name": "Event Planner",
          "company": "Yanbal International",
          "logo": "https://media.licdn.com/mpr/mpr/shrinknp_100_100/AAEAAQAAAAAAAAiFAAAAJDg1MWJlZWU3LTRmZTUtNDlmOS1hYzY3LTQ3NmJjZDY4MDdjZQ.png",
          "location": "Deerfield Beach, Florida",
          "description": "Work closely with cross-functional departments, External Vendors and leadership to define event goals, objectives and initiatives that ... ",
          "other_details": {
            "full_description": {
              "Omitted from this documentation, too long"
            },
            "industries": [
              "Fine Art"
            ],
            "experience": "Mid-Senior level",
            "functions": [
              "Marketing"
            ],
            "listDate": "June 4, 2016",
            "expireDate": "July 4, 2016"
          }
        }
      }
  */
  .get(cache('10 minutes'), function (req, res) {
    Jobs.findOne({job_id: req.params.job_id}, function (err, job) {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      if (!job) return res.status(status.NOT_FOUND).json({error: 'Job not found!'})
      res.json({job: job})
      // Initially i want to implement some "lazy load" kind of thing, so we scrape the details only when we need it
      // but apparently heroku IP is blocked by LinkedIn so i don't want any scraping in this endpoint
      /* if (job.other_details == null) {
        var url = urlBuilder.buildDetailUrl(job.job_id)
        request(url, function (err, resp, html) {
          if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
          if (resp.statusCode === 404 || resp.statusCode === 500) return res.status(resp.statusCode).send('Error ' + resp.statusCode)
          var details = scraper.getJobDetails(html)
          console.log(details)
          job.other_details = details
          job.save(function (err, job){
            if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
                res.json({job: job})
              })
            })
          }
        else{
            res.json({job: job})
          }
        })*/
    })
  })
  /**
  * @api {put} api/jobs/:job_id Modify a job
  * @apiName PutJobs
  * @apiGroup Jobs
  * @apiParam {String} job_id this must be unique, scraped job would use linkedin id
  * @apiParam {String} job_name Job title/name
  * @apiParam {String} company Company Name
  * @apiParam {String} logo Logo Image URI
  * @apiParam {String} location Job Location
  * @apiParam {String} description Job description
  * @apiParam {Object} other_details Job Details, it's an object you can insert any details you need
  * @apiSuccess {String} message message containing "Job Successfully Created!"
  * @apiSuccess {Object} job Job Object that just updated
  * @apiParamExample {json} Request-Example:
    {
      job_name: "Software Engineer Test",
    }
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {
          "message": "Job Successfully Updated!",
          "job":
            {
              "__v": 0,
              "job_id": "Test100",
              "job_name": "Software Engineer Test",
              "company": "UrbanHire",
              "logo": "mylogo",
              "location": "Jakarta",
              "description": "NodeJs Engineer",
              "_id": "575410d2c88171681f21c053"
              "other_details" : {}
            }
        }
  */
  .put(function (req, res) {
    Jobs.findOneAndUpdate({job_id: req.params.job_id}, req.body, {new: true, $upsert: true}, function (err, job) {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      res.json({message: 'Job Successfully Updaated!', job: job})
    })
  })
  /**
  * @api {delete} api/jobs/:job_id Delete specific jobs
  * @apiName DeleteJob
  * @apiGroup Jobs
  * @apiSuccess {String} message 'Job Successfully Deleted!'
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {"message": "Job Successfully deleted!"}
  */
  .delete(function (req, res) {
    Jobs.findOne({job_id: req.params.job_id}).remove(function (err, job) {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      res.json({message: 'Job Successfully deleted!'})
    })
  })

/**
* @api {get} api/search?q=<search keywords> Request all jobs
* @apiName GetJobs
* @apiGroup Jobs
* @apiSuccess {json} results 'All relevant jobs to keywords sorted from highest to lowest'
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {
        "results":[
          {"_id":"5752e350cf6a694c1c5cf61d","job_id":"161059141","job_name":"Process Engineer","company":"INNOViON Corporation","location":"Wilmington, Massachusetts","score":0.75},
          {"_id":"575410d2c88171681f21c053","job_id":"Test100","job_name":"Software Engineer Test","company":"UrbanHire","location":"Jakarta","score":0.6666666666666666},
          {"_id":"5753d6f6d8c783001f3c761e","job_id":"161626738","job_name":"System/Software Engineer","company":"Sonalysts, Inc.","location":"Middletown, Rhode Island","score":0.6666666666666666},
          {"_id":"5753d6f6d8c783001f3c7616","job_id":"161627182","job_name":"Junior System/Software Engineer","company":"Sonalysts, Inc.","location":"Middletown, Rhode Island","score":0.625}
        ]
      }
*/
router.get('/search', function (req, res) {
  if (req.query.q == null) return res.json({error: 'Search query is empty'})
  Jobs
    .find(
      {$text: {$search: req.query.q}},
      {score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .limit(10)
    .select('job_id job_name company location')
    .exec()
    .then(function (jobs) {
      return res.json({results: jobs})
    })
    .catch(function (err) {
      return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    })
})

module.exports = router
