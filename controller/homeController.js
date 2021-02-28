/**
 * New catch Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

'use strict'
require("dotenv").config();
const User = require('../models/userModel')
const jwt = require("jsonwebtoken")

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
catchController.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (user) {
      const compare = await user.comparePassword(req.body.password)
      console.log(compare)
      if (user && compare) {
        const token = jwt.sign({
          data: req.body.username
        }, process.env.JWT_TOKEN_SECRET, { expiresIn: 3600 });      
        res.status(200).json({ message: "User logged in!", token })
      } else {
        res.status(400).json({ message: "Username or password incorrect" })
      }
    } else {
      res.status(400).json({ message: "User not found!" })
      
    }
  } catch (error) {
    res.status(500).json({ message: "Error when logging in", error: error.message})
  }
}

catchController.logout = async (req, res) => {
  res.json({ msg: "login"})
}

module.exports = catchController
