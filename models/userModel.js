/**
 * User schema.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

'use strict'

const bcrypt = require('bcryptjs')

const mongoose = require('mongoose')
const SALT = 10

// The schema for creating a new user.
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be at least 10 characters.']
  }
}, {
  timestamps: true,
  versionKey: false
})

/** Salt and hashes the password before saving to the database.
 *
 * @param {string}
 */
UserSchema.pre('save', function (next) {
  const user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT, function (err, salt) {
    if (err) return next(err)

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

/** Compares the DB-users password with the password provided in the login-page.
 *
 * @param {string} candidatePassword The password given in th login.
 * @returns {string} The result of the compared usernames.
 */
UserSchema.methods.comparePassword = function (candidatePassword) {
  console.log(this.password)
  console.log(candidatePassword)
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User
