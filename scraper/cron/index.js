'use strict'

module.exports = cron => {
  let tasks = [
    {
      name: 'inkscraper: list',
      interval: '12 hours',
      counts: 1000,
      run: require('./list').getAllJobs
    },
    {
      name: 'inkscraper: detail',
      interval: '10 seconds',
      run: require('./detail').getDetailJobs
    }
  ]
  _.forEach(tasks, (task) => {
    cron.define(task.name, { concurrency: 1 }, (job, done) => {
      task.run(task, done)
    })
    cron.every(task.interval, task.name)
  })
}
