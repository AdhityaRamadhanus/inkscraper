'use strict'

exports.createKeyFromURL = (opts) => {
  let url = opts.url
  let allowedQuery = opts.allowedQuery
  let query = opts.query
  let method = opts.method
  // tricky solution
  let redisKey = method + url.split('?')[0]
  redisKey = redisKey.replace(/\//g, ':')
  _.forEach(allowedQuery, (key) => {
    let val = query[key]
    if (!_.isEmpty(val)) {
      redisKey += `:${key}=${val}`
    }
  })
  return redisKey
}
