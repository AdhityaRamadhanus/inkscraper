const mongoose = require('mongoose')
const Job = mongoose.model('Job')

module.exports.getOne = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    Job.findOne({job_id: args.id}, (err, job) => {
      if (err) reject(err)
      else{
        var resolvedjob = {
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

module.exports.getAll = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    Job
      .find({}, 'job_id job_name company location')
      .lean()
      .exec((err, jobs) => {
        if (err) reject(err)
        else{
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

module.exports.searchJobs = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    if (!req.query.q) reject(new Error('Search query is empty'))
    else{
      Job
        .find(
          {$text: {$search: req.query.q}},
          {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}})
        .limit(10)
        .select('job_id job_name company location')
        .exec((err, jobs) => {
          if (err) reject(err)
          else{
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