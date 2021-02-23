require("dotenv").config();
const mongoose = require("mongoose")


mongoose.Promise = global.Promise

const CONNECTION_STRING = process.env.CONNECTION_STRING

/**
 * Establishes a connection to a database.
 *
 * @returns {Promise} Resolves to this if connection succeeded.
 */
module.exports.connect = async () => {
  mongoose.connection.on('connected', () => { console.log('MongoDB connected') })
  mongoose.connection.on('error', err => { console.log(`MongoDB connection error ${err}`) })
  mongoose.connection.on('disconnected', () => { console.log('MongoDB connection error') })

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application terminate')
      process.exit(0)
    })
  })

  return mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}