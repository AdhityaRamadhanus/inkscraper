/* node module dependencies */
const express = require('express')
const router = express.Router()
const apicache = require('apicache')
const cache = apicache.options({debug: true}).middleware
/* Load Handler */
const apiHandlers = require('../handlers/api')

router
  .get('/jobs', apiHandlers.getAllJobs)
  .get('/jobs/:job_id', apiHandlers.getJob)
  .get('/search', apiHandlers.searchJobs)
  .post('/jobs', apiHandlers.postJob)
  .post('/jobs/:job_id', apiHandlers.updateJob)
  .delete('/jobs/:job_id', apiHandlers.deleteJob)

module.exports = router
