// Standart Test :PASSED
var cheerio = require('cheerio')
var scrap = scrap || {}
scrap.getJobs = function (html) {
  var $ = cheerio.load(html)
  function HtmlToJson (elmt) {
    /* Rebind $ */
    $ = cheerio.load(elmt)
    /* Get the Job Id using regex */
    var url = $('meta[itemprop=url]').attr('content')
    var re = /jobs\/view\/([0-9]+).*/
    var m
    /* m[0] is full string e.g /job/view/666 and m[1] is the id e.g 666*/
    if ((m = re.exec(url)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++
      }
    }
    var id = m[1]
    var location = $('.job-details .job-location-posted-time .job-location').text()
    var logo = $('.company-logo-link img').attr('data-delayed-url')
    var jobName = $('.job-details .job-title-line .job-title .job-title-link .job-title-text').text()
    var company = $('.job-details .company-name-line .company-name .company-name-link').text()
    var description = $('.job-details .job-description').text()

    var job = {job_id: id,
              job_name: jobName,
              company: company,
              logo: logo,
              location: location,
              description: description}
    return job
  }
  return $('.search-results .job-listing').toArray().map(HtmlToJson)
}

scrap.getJobDetails = function (html) {
  // 'Client-Side Rendering' Scraping , apparently the json string is present as html comment
  var $ = cheerio.load(html)
  var url = $('meta[property="og:url"]').attr('content')
  var re = /jobs\/view\/([0-9]+).*/
  var m
  /* m[0] is full string e.g /job/view/666 and m[1] is the id e.g 666*/
  if ((m = re.exec(url)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++
    }
  }
  var id = m[1]
  // get the json string
  var rawJobDetails = $('code[id=decoratedJobPostingModule]').contents()
  // parse json string
  var jobDetails = JSON.parse(rawJobDetails[0].data)
  var ret ={
    job_id: id,
    other_details:{
      full_description: jobDetails.decoratedJobPosting.jobPosting.description,
      industries: jobDetails.decoratedJobPosting.formattedIndustries,
      experience: jobDetails.decoratedJobPosting.formattedExperience,
      functions: jobDetails.decoratedJobPosting.formattedJobFunctions,
      listDate: jobDetails.decoratedJobPosting.formattedListDate,
      expireDate: jobDetails.decoratedJobPosting.formattedExpireDate
    }
  }
  return ret
}

module.exports = scrap
