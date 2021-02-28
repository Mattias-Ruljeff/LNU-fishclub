/**
 * Snippet schema.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

'use strict'

const mongoose = require('mongoose')

// The schema for creating a snippet.
const CatchSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  fishType: {
    type: String,
    required: true
  },
  fishLength: {
    type: String,
    required: true
  },
  fishWeight: {
    type: String,
    required: true
  },
  longAndLatPos: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: true
  },
  lake: {
    type: String,
    required: true
  }},
  {timestamps: true}
)

const Catch = mongoose.model('Catch', CatchSchema)

module.exports = Catch
