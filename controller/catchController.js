/**
 * New catch Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

'use strict'

const Catch = require('../models/catchModel')

const catchController = {}

/**
 * Gets all the current catches.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.index = async (req, res) => {
  res.json({ msg: "All fish"})
}

/**
 * Logs a catch for a user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.logCatch = async (req, res) => {
  res.json({ msg: "Log catched fish"})
}

module.exports = catchController
