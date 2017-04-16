const mongoose = require('mongoose')
const Job = mongoose.model('Job')

exports.getOne = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    let query = {
      job_id: args.id
    }
    Job
      .findOne(query)
      .exec((err, job) => {
        if (err) reject(err)
        else {
          let resolvedjob = {
            id: job.job_id,
            title: job.job_name,
            other_details: job.other_details,
            company: job.company,
            location: job.location,
            detail_url: job.detail_url
          }
          resolve(resolvedjob)
        }
      })
  })
}

exports.getAll = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    Job
      .find({}, 'job_id job_name company location')
      .lean()
      .exec((err, jobs) => {
        if (err) reject(err)
        else {
          var resolvedjobs = jobs.map((job) => {
            return {
              id: job.job_id,
              title: job.job_name,
              company: job.company,
              location: job.location
            }
          })
          resolve(resolvedjobs)
        }
      })
  })
}

exports.searchJobs = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    if (!req.query.q) reject(new Error('Search query is empty'))
    else {
      Job
        .find(
          {$text: {$search: req.query.q}},
          {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}})
        .limit(10)
        .select('job_id job_name company location')
        .exec((err, jobs) => {
          if (err) reject(err)
          else {
            var resolvedjobs = jobs.map((job) => {
              return {
                id: job.job_id,
                title: job.job_name,
                company: job.company,
                location: job.location
              }
            })
            resolve(resolvedjobs)
          }
        })
    }
  })
}
