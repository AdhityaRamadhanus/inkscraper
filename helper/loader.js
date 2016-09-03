'use strict'
const fs = require('fs')
const _ = require('lodash')
const path = require('path')

module.exports.loadRoute = (dirName, app) => {
  fs.readdir(dirName, (err, listFiles) => {
    if (err) console.log(err)
    var filteredList = _.filter(listFiles, (file) => {
      return (file.indexOf('.js') > 0)
    })
    _.forEach(filteredList, (module) => {
      var cleanModule = _.replace(module, '.js', '')
      app.use('/' + cleanModule, require(path.join(dirName, cleanModule)))
      console.log(cleanModule + ' route loaded')
    })
    console.log('Finish Load')
  })

} 