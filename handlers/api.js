'use strict'

const mongoose = require('mongoose')
const Jobs = mongoose.model('Job')
const status = require('http-status')

module.exports.getAllJobs = (req, res, next) => {
  Jobs.find({}, 'job_id job_name company location', (err, jobs) => {
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() })
    res.json({ results: jobs })
  })
}

module.exports.postJob = (req, res, next) => {
  Jobs(req.body).save((err, job) => {
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    res.status(201).json({message: 'Job Successfully Created!', job: job})
  })
}

module.exports.deleteJobs = (req, res, next) => {
  Jobs.remove({}, (err) => {
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    res.status(200).json({message: 'All Job Successfully Deleted!'})
  })
}

module.exports.getJob = (req, res, next) => {
  Jobs.findOne({ job_id: req.params.job_id }, (err, job) => {
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    if (!job) return res.status(status.NOT_FOUND).json({error: 'Job not found!'})
    res.json({job: job})
  })
}

module.exports.updateJob = (req, res, next) => {
  Jobs.findOneAndUpdate({job_id: req.params.job_id}, req.body, 
    {new: true, $upsert: true}, 
    (err, job) => {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      res.json({message: 'Job Successfully Updaated!', job: job})
    })
}

module.exports.deleteJob = (req, res, next) => {
  Jobs.findOne({job_id: req.params.job_id}).remove((err, job) => {
    if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
    res.json({message: 'Job Successfully deleted!'})
  })
}

module.exports.searchJobs = (req, res, next) => {
  if (!req.query.q) return res.json({error: 'Search query is empty'})
  Jobs
    .find(
      {$text: {$search: req.query.q}},
      {score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .limit(10)
    .select('job_id job_name company location')
    .exec((err, jobs) => {
      if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
      return res.json({results: jobs})
    })
}