// Standard Test : PASSED
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// Job Schema
var JobSchema = Schema({
  // not ObjectId MongoDB
  job_id: {type: String, required: true, unique: true},
  job_name: {type: String, required: true},
  company: {type: String, required: true},
  // URI
  logo: {type: String},
  location: {type: String},
  description: {type: String},
  other_details: Schema.Types.Mixed,
  is_detail: {
    type: Boolean,
    default: false
  }
})

JobSchema.plugin(require('mongoose-timestamp'))
JobSchema.index({
  job_id: 'text',
  job_name: 'text',
  company: 'text',
  location: 'text'
})

module.exports = mongoose.model('Job', JobSchema)
