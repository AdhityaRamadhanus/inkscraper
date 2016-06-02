var express = require('express')
var router = express.Router()
var status = require('http-status')

var db = require('../db')

var mongoose = require('mongoose')
var Jobs = mongoose.model('Job')

// CRUD for Jobs
router.route('/jobs')
      .get(function (req, res) {
        Jobs.find(function (err, jobs) {
          if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
          res.json({results: jobs})
        })
      })
      .post(function (req, res) {
        Jobs(req.body).save(function (err, job) {
          if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
          res.status(201).json({message: 'Job Successfully Created!', job: job})
        })
      })

router.route('/jobs/:job_id')
      .get(function (req, res) {
        Jobs.findOne({job_id : req.params.job_id}, function (err, job) {
          if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
          if (job == null)  return res.status(status.NOT_FOUND).json({error: "Job not found!"})
          res.json({job: job})
        })
      })
      .put(function (req, res) {
        Jobs.findOneAndUpdate({job_id: req.params.job_id},req.body,{$new: true,$upsert: true},function (err, job) {
          if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
          res.json({job: job})
        })
      })
      .delete(function (req, res) {
        Jobs.findOne({job_id: req.params.job_id}).remove(function (err, job) {
          if (err) return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()})
          res.json({message: "Job Successfully deleted!"})
        })
      })

module.exports = router
