/* global logger */
'use strict'
const fs = require('fs')
const path = require('path')

module.exports.loadRoute = (dirName, app) => {
  let listFiles = fs.readdirSync(dirName)
  let filteredList = _.filter(listFiles, (file) => {
    return (file.indexOf('.js') > 0)
  })

  _.forEach(filteredList, (module) => {
    let cleanModule = _.replace(module, '.js', '')
    app.use('/' + cleanModule, require(path.join(dirName, cleanModule)))
    logger.info('Route /' + cleanModule + ' loaded')
  })
}
