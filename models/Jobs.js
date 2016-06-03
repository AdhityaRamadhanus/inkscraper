// Standard Test : PASSED
var mongoose = require('mongoose')
var Schema = mongoose.Schema
// Job Schema
var JobSchema = Schema({
  // id tapi bukan ObjectId MongoDB
  job_id: {type: String, required: true, unique: true},
  job_name: {type: String, required: true},
  company: {type: String, required: true},
  // URI
  logo: {type: String},
  location: {type: String},
  description: {type: String},
  other_details: {}
})

module.exports = mongoose.model('Job', JobSchema)
