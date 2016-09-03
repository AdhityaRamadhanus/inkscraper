/* node module dependencies */
const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const cache = apicache.options({debug: true}).middleware
/* Load Model */
const mongoose = require('mongoose')
const Jobs = mongoose.model('Job')
/* Load Handler */
const apiHandlers = require('../handlers/api')
// CRUD for Jobs

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
router.get('/jobs', cache('10 minutes'), apiHandlers.getAllJobs)
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
router.post('/jobs', (req, res, next) => {
    apicache.clear('JobList')
    next()
  },
  apiHandlers.postJob)
  /**
  * @api {delete} api/jobs Delete all jobs
  * @apiName DeleteJobs
  * @apiGroup Jobs
  * @apiSuccess {String} message 'All Job Successfully Deleted!'
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {"message": "All Job Successfully Deleted!"}
  */
router.delete('/jobs', (req, res, next) => {
    apicache.clear('JobList')
    next()
  },
  apiHandlers.deleteJobs)
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
router.get('/jobs/:job_id', cache('10 minutes'), apiHandlers.getJob)
 
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
router.post('/jobs/:job_id', apiHandlers.updateJob)
  /**
  * @api {delete} api/jobs/:job_id Delete specific jobs
  * @apiName DeleteJob
  * @apiGroup Jobs
  * @apiSuccess {String} message 'Job Successfully Deleted!'
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 200 OK
  *     {"message": "Job Successfully deleted!"}
  */
router.delete('/jobs/:job_id', apiHandlers.deleteJob)

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
router.get('/search', apiHandlers.searchJobs)

module.exports = router
