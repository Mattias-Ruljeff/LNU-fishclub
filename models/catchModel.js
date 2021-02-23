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
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true
  },
  fishType: {
    type: String,
    required: true
  },
  lenght: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  longAndLat: {
    type: Object,
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
