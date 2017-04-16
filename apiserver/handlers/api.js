'use strict'

const mongoose = require('mongoose')
const Jobs = mongoose.model('Job')
const status = require('http-status')
const redisHelper = require('../helpers/rediskey')
const cache = require('../cache')

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
exports.getAllJobs = (req, res, next) => {
  let page = parseInt(req.query.page, 10) || 1
  let size = parseInt(req.query.limit, 10) || 10
  let startFrom = (page > 1) ? (page - 1) * (size > 50 ? 50 : size) : 0
  if (startFrom + size > 10000) {
    startFrom = 9990
    size = 10
  }
  let redisKey = redisHelper.createKeyFromURL({
    url: req.originalUrl,
    query: req.query,
    allowedQuery: ['page', 'limit'],
    method: req.method
  })
  cache.get(redisKey, (data) => {
    if (data) {
      return res.json({
        timestamp: new Date().toISOString(),
        data: data
      })
    }
    let query = {}
    Jobs
      .find(query, 'job_id job_name company location')
      .limit(size)
      .skip(startFrom)
      .exec((err, jobs) => {
        if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({ timestamp: new Date().toISOString(), error: err.toString() })
        cache.setex(redisKey, 60, jobs)
        return res.json({
          timestamp: new Date().toISOString(),
          data: jobs
        })
      })
  })
}

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
exports.postJob = (req, res, next) => {
  let job = Jobs(req.body)
  job.save((err, job) => {
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({timestamp: new Date().toISOString(), error: err.toString()})
    res.status(201).json({
      timestamp: new Date().toISOString(),
      message: 'Job Successfully Created!',
      data: job})
  })
}

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
module.exports.getJob = (req, res, next) => {
  Jobs.findOne({ job_id: req.params.job_id }, (err, job) => {
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({timestamp: new Date().toISOString(), error: err.toString()})
    if (!job) return res.status(status.NOT_FOUND).json({error: 'Job not found!'})
    return res.json({
      timestamp: new Date().toISOString(),
      data: job
    })
  })
}
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
module.exports.updateJob = (req, res, next) => {
  Jobs.findOneAndUpdate({job_id: req.params.job_id}, req.body,
    {new: true, $upsert: true},
    (err, job) => {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      return res.json({
        timestamp: new Date().toISOString(),
        message: 'Job Successfully Updaated!',
        data: job
      })
    })
}
  /**
  * @api {delete} api/jobs/:job_id Delete specific jobs
  * @apiName DeleteJob
  * @apiGroup Jobs
  * @apiSuccess {String} message 'Job Successfully Deleted!'
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {"message": "Job Successfully deleted!"}
  */
module.exports.deleteJob = (req, res, next) => {
  Jobs
    .findOneAndRemove({job_id: req.params.job_id})
    .exec((err, job) => {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({timestamp: new Date().toISOString(), error: err.toString()})
      return res.json({
        timestamp: new Date().toISOString(),
        message: 'Job Successfully deleted!'
      })
    })
}

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
module.exports.searchJobs = (req, res, next) => {
  req.query.q = req.query.q || ''

  let page = parseInt(req.query.page, 10) || 1
  let size = parseInt(req.query.limit, 10) || 10
  let startFrom = (page > 1) ? (page - 1) * (size > 50 ? 50 : size) : 0
  if (startFrom + size > 10000) {
    startFrom = 9990
    size = 10
  }
  let redisKey = redisHelper.createKeyFromURL({
    url: req.originalUrl,
    query: req.query,
    allowedQuery: ['page', 'limit', 'q'],
    method: req.method
  })
  cache.get(redisKey, (data) => {
    if (data) {
      return res.json({
        timestamp: new Date().toISOString(),
        data: data
      })
    }
    Jobs
      .find(
        {$text: {$search: req.query.q}},
        {score: {$meta: 'textScore'}})
      .sort({score: {$meta: 'textScore'}})
      .limit(size)
      .skip(startFrom)
      .select('job_id job_name company location')
      .exec((err, jobs) => {
        if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({timestamp: new Date().toISOString(), error: err.toString()})
        cache.setex(redisKey, 60, jobs)
        return res.json({
          timestamp: new Date().toISOString(),
          data: jobs
        })
      })
  })
}
