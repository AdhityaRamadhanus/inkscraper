/* node module dependencies */
const express = require('express')
const scraperHandlers = require('../handlers/scraper')
const router = express.Router()

/* Load Model */
const mongoose = require('mongoose')
const Jobs = mongoose.model('Job')
// Scraping Endpoint
// Insert operation, every jobs (if any) will be inserted using bulk insert operation
/**
* @api {get} scrape/insert Scrape Jobs from linkedin listing page
* @apiName InsertJobs
* @apiGroup Scrape
* @apiSuccess {String} message 'Scrape Done'
* @apiSuccess {Number} inserted_count Number of jobs saved
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message": "Scrape Done", "inserted_count": 25}
*/
router.get('/insert', scraperHandlers.insertJobs)
// Upsert operation, every jobs (if any) will be upserted, this operation is slower than bulk insert, this is for sync
router.get('/update', scraperHandlers.updateJobs)
/**
* @api {get} scrape/details Scrape Job Details from linkedin details page
* @apiName GetJobDetails
* @apiGroup Scrape
* @apiSuccess {String} message 'Scrape Done'
* @apiSuccess {Number} inserted_count Number of jobs saved
* @apiSuccessExample Success-Response:
*     HTTP/1.1 200 OK
*     {"message": "Scraping Detail Done", "updated_jobs": 25}
*/
router.get('/details', scraperHandlers.getJobDetails)
module.exports = router
