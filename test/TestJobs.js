'use strict'
var describe = require('mocha').describe
var it = require('mocha').it
require('should')
var server = require('../server')
var supertest = require('supertest')

describe('Jobs Endpoint', function () {
  it('Can add job', function (done) {
    var job = {
      job_id: 'Test100',
      job_name: 'Software Engineer',
      company: 'UrbanHire',
      logo: 'mylogo',
      location: 'Jakarta',
      description: 'NodeJs Engineer',
      detail_url: 'test'
    }
    supertest(server)
      .post('/api/jobs')
      .send(job)
      .end(function (err, res) {
        if (err) {
          throw err
        }
        res.status.should.equal(201)
        res.body.message.should.equal('Job Successfully Created!')
        done()
      })
  })
  it('Get specific job', function (done) {
    supertest(server)
      .get('/api/jobs/Test100')
      .end(function (err, res) {
        if (err) {
          throw err
        }
        res.status.should.equal(200)
        res.body.job.job_id.should.equal('Test100')
        done()
      })
  })
  it('Can modify job', function (done) {
    var job = {
      job_name: 'Software Engineer Test'
    }
    supertest(server)
      .post('/api/jobs/Test100')
      .send(job)
      .end(function (err, res) {
        if (err) {
          throw err
        }
        res.status.should.equal(200)
        done()
      })
  })
  it('Can delete job', function (done) {
    supertest(server)
      .delete('/api/jobs/Test100')
      .end(function (err, res) {
        if (err) {
          throw err
        }
        res.status.should.equal(200)
        done()
      })
  })
})
