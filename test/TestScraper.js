'use strict'
var describe = require('mocha').describe
var it = require('mocha').it
require('should')
var fs = require('fs')
var path = require('path')
var scraper = require('../scraper/scraper')
describe('Scraper Function', function () {
  // this simplistic test case seriously need some change
  it('Should get 25 jobs and one of them is Senior Advisor, Planning and Performance Monitoring and Assessment', function (done) {
    console.log(__dirname)
    fs.readFile(path.join(__dirname, '/LinkedinTestViewAll.html.test'), 'utf8', function (err, data) {
      if (err) throw err
      var rawJobs = scraper.getJobs(data)
      rawJobs.length.should.equal(25)
      done()
    })
  })
  it('Should get specific job details', function (done) {
    console.log(__dirname)
    fs.readFile(path.join(__dirname, '/LinkedinTestDetail.html.test'), 'utf8', function (err, data) {
      if (err) throw err
      var specificJobs = scraper.getJobDetails(data)
      specificJobs.other_details.listDate.should.equal('June 3, 2016')
      specificJobs.other_details.expireDate.should.equal('July 3, 2016')
      done()
    })
  })
})
