// Standart Test :PASSED
const cheerio = require('cheerio')
const scrap = scrap || {}
// It's advised to use promised style when calling these scraper
// so every error in here will be caught rather than creating handle for every error
scrap.getJobs = (html) => {
  const $ = cheerio.load(html)
  var rawJobs = $('code[id=decoratedJobPostingsModule]').contents()
  var jobsObj = JSON.parse(_.result(rawJobs[0], 'data'))
  var jobsMapped = _.map(_.result(jobsObj, 'elements'), (job) => ({
    job_id: job.decoratedJobPosting.jobPosting.id,
    job_name: job.decoratedJobPosting.jobPosting.title,
    company: job.decoratedJobPosting.companyName,
    logo: (!_.isNil(job.decoratedJobPosting.decoratedCompany.companyLogo)) ? job.decoratedJobPosting.decoratedCompany.companyLogo.urn : 'default',
    location: job.decoratedJobPosting.formattedLocation,
    description: job.decoratedJobPosting.formattedDescription
  }))
  return jobsMapped
}

// It's advised to use promised style when calling these scraper
// so every error in here will be caught rather than creating handle for every error
scrap.getJobDetails = (html) => {
  // 'Client-Side Rendering' Scraping , apparently the json string is present as html comment
  const $ = cheerio.load(html)
  // get the json string
  var rawJobDetails = $('code[id=decoratedJobPostingModule]').contents()
  // parse json string
  var jobDetails = JSON.parse(_.result(rawJobDetails[0], 'data'))
  return {
    job_id: jobDetails.decoratedJobPosting.jobPosting.id,
    other_details: {
      full_description: jobDetails.decoratedJobPosting.jobPosting.description,
      industries: jobDetails.decoratedJobPosting.formattedIndustries,
      experience: jobDetails.decoratedJobPosting.formattedExperience,
      functions: jobDetails.decoratedJobPosting.formattedJobFunctions,
      listDate: jobDetails.decoratedJobPosting.formattedListDate,
      expireDate: jobDetails.decoratedJobPosting.formattedExpireDate
    }
  }
}

module.exports = scrap
