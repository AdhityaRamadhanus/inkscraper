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

module.exports = router
