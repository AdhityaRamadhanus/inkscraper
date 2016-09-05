'use strict'
var describe = require('mocha').describe
var it = require('mocha').it
var after = require('mocha').after
var should = require('should')
var mongoose = require('mongoose')
var Jobs = mongoose.model('Job')

describe('Jobs Model', function () {
  after(function () {
    Jobs.remove({job_id: 'Test100'}, function (err) {
      //if (err) console.error(err)
      console.log('Remove all dummy jobs created during test')
    })
  })
  it('Should add job', function (done) {
    var job = {
      job_id: 'Test100',
      job_name: 'Software Engineer',
      company: 'UrbanHire',
      logo: 'mylogo',
      location: 'Jakarta',
      description: 'NodeJs Engineer',
      detail_url: 'test'
    }
    Jobs(job).save(function (err, job) {
      if (err) console.log('Valid Job cannot be saved')
      should.not.exist(err)
      done()
    })
  })
  it('Should not add duplicated job', function (done) {
    var job = {
      job_id: 'Test100',
      job_name: 'Software Engineer',
      company: 'UrbanHire',
      logo: 'mylogo',
      location: 'Jakarta',
      description: 'NodeJs Engineer',
      detail_url: 'test'
    }
    Jobs(job).save(function (err, job) {
      if (err) console.log('Duplicated Job cannot be saved')
      should.exist(err)
      done()
    })
  })
})
