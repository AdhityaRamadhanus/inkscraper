'use strict'
var path = require('path')
var async = require('async')
var dir = process.argv[0] || './'
var promise = require('bluebird')
var fs = promise.promisifyAll(require('fs'))

function analyzeModules (dir, indent){
  fs.readdirAsync(path.join(dir, 'node_modules'))
    .filter(function (file){
      return fs.statSync(path.join(dir, 'node_modules', file)).isDirectory() && file !== '.bin'
    })
    .then(function (files) {
      async.eachSeries(files, function (file, callback) {
        fs.readFileAsync(path.join(dir, 'package.json'), 'utf8').
        then(function (content) {
          var dep = JSON.parse(content)
          if (dep._id) console.log(dep._id)
        })
        .then(function (){
          analyzeModules(path.join(dir, 'node_modules', file), indent + '  |->')
        })
        .then(function (){
          callback()
        })
      })
    })
    .catch(function (err){})
}

function one (callback) {
  console.log('one')
  callback()
}
function two (callback) {
  console.log('two')
  callback({a: 5},'three')
}

async.waterfall([one,two], function (err, result) {
  console.log(result, this.a)
})
