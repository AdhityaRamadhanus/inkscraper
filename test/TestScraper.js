'use strict'
require('should')
require('assert')
var fs = require('fs')
var scraper = require('../module/scraper')
describe('Scraper Function', function () {
  // this simplistic test case seriously need some change
  it('Should get 25 jobs and one of them is Senior Advisor, Planning and Performance Monitoring and Assessment', function (done) {
    console.log(__dirname)
    fs.readFile(__dirname+'/LinkedinTestViewAll.html', 'utf8', function (err,data) {
      if (err) throw err
      var rawJobs = scraper.getJobs(data)
      var specificJobs = rawJobs.filter(function (e) {
        return e.job_name==='Senior Advisor, Planning and Performance Monitoring and Assessment'
      })
      rawJobs.length.should.equal(25)
      specificJobs.length.should.equal(1)
      done()
    })
  })
  it('Should get specific job details', function (done) {
    console.log(__dirname)
    fs.readFile(__dirname+'/LinkedinTestDetail.html', 'utf8', function (err,data) {
      if (err) throw err
      var specificJobs = scraper.getJobDetails(data)
      specificJobs.listDate.should.equal('June 3, 2016')
      specificJobs.expireDate.should.equal('July 3, 2016')
      done()
    })
  })
})
