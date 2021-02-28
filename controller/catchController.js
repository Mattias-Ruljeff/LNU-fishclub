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
try {
  Catch.find({}, (catches, err) => {
    if (error) {
      res.status(400).json({message:"Error while fetching catches",error})
    }
    res.status(200).json({message: "All catches", catches})
  })
  
} catch (error) {
  res.status(500).json({message:"Error while fetching catches", error})
}

  res.json({ message: "All catches"})
}

/**
 * Logs a catch for a user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.logCatch = async (req, res) => {
  if (req.body) {
    const {username, fishType, fishLength, fishWeight, longAndLatPos, city, lake} = req.body
    
    try {
      const newCatch = new Catch({
        username: username,
        fishType: fishType,
        fishLength: fishLength,
        fishWeight: fishWeight,
        longAndLatPos: longAndLatPos,
        city: city,
        lake: lake
      })
      
      await newCatch.save()
      res.status(201).json({message: "Catch saved!"})
      
      
    } catch (error) {
      
      res.status(500).json({message: "Error while creating user...", error: error.message})
    }
  }
  // res.status(200).json({message: "Catch saved"})
}

module.exports = catchController
