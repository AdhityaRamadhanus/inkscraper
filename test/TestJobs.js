'use strict'
require('should')
require('assert')
var supertest = require('supertest')

var server = supertest.agent('http://localhost:3000')

describe('Jobs Endpoint', function () {
  it('Can add job', function (done) {
    var job = {
      job_id: 'Test100',
      job_name: 'Software Engineer',
      company: 'UrbanHire',
      logo: 'mylogo',
      location: 'Jakarta',
      description: 'NodeJs Engineer'
    }
    server
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
  it('Can modify job', function (done) {
    var job = {
      job_name: 'Software Engineer Test'
    }
    server
      .put('/api/jobs/Test100')
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
    server
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
