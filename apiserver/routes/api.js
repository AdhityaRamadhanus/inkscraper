/* node module dependencies */
const express = require('express')
const router = express.Router()
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
