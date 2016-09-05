var linkedinurl = process.env.DEFAULT_LINKEDIN_DETAIL_URL
module.exports.buildDetailUrl = (jobId) => {
  return linkedinurl + jobId
}
