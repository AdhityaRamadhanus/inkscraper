// Standard Test : PASSED
module.exports = (dbURI, mongoose) => {
  mongoose.connect(dbURI) // connect to our database
  // Connected
  mongoose.connection.on('connected', function () {
    console.log('Mongoose connected')
  })
  // Error
  mongoose.connection.on('error', function (err) {
    console.log('Mongoose got error : ' + err)
  })
  // Disconnected
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected')
  })
  // Node process terminated
  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('Disconnect mongoose')
      process.exit(0)
    })
  })

  require('../../models/Jobs')
}
