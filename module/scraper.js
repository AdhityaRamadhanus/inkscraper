var cheerio = require('cheerio')
var scrap = scrap || {}
scrap.getJobs = function (html){
  var $ = cheerio.load(html)
  var Jobs = $('.search-results .job-listing').map(HtmlToJson)
  function HtmlToJson (idx,elmt){
    var data = $(this)
    var location = data.children().last().children('.job-location-posted-time').first().text()
    var desc = data.children().last().children().last().prev().text()
    console.log(location)
    console.log()
    return elmt
  }
  return Jobs
}
module.exports = scrap
