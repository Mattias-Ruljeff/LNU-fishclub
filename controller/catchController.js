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
catchController.getOneUsersCatches = async (req, res) => {
try {
  Catch.find({"username": `${req.params.username}`}, (err, catches) => {
    if(catches.length === 0) res.status(200).json({message: "No cathes registered"})
    
    if (err) {
      res.status(400).json({message:"Error while fetching catches",err})
    }
    res.status(200).json({message: `All catches from user ${req.params.username}`, catches})
  })
  
} catch (error) {
  res.status(500).json({message:"Error while fetching catches", error})
}

  // res.json({ message: "All catches"})
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

catchController.updateCatch = async (req, res) => {
  if (req.body) {
    const {username, fishType, fishLength, fishWeight, longAndLatPos, city, lake} = req.body
    try {
      const catchFromDB = await Catch.findById(req.body.catchId, (err, doc) => {
        if (err) {
          res.status(400).json({message: "Error while finding catch", err})
        }
      })
      if (req.body.username === catchFromDB.username) {
        Catch.findByIdAndUpdate(req.body.catchId,
          { username: username !== "" ? username : catchFromDB.username,
            fishType: fishType !== "" ? fishType : catchFromDB.fishType,
            fishLength: fishLength !== "" ? fishLength : catchFromDB.fishLength,
            fishWeight: fishWeight !== "" ? fishWeight : catchFromDB.fishWeight,
            longAndLatPos: longAndLatPos !== "" ? longAndLatPos : catchFromDB.longAndLatPos,
            longAndLatPos: longAndLatPos !== "" ? longAndLatPos : catchFromDB.longAndLatPos,
            city: city !== "" ? city : catchFromDB.city,
            lake: lake !== "" ? lake : catchFromDB.lake
          },
          { new: true },
          function (err, doc, result) {
            if (err) {
              res.send(err)
            } else {
              req.session.flash = { type: 'success', text: 'The snippet was updated.' }
              res.redirect('/snippets')
            }
          }
          )
        }
      } catch (error) {
        // If an error, or validation error, occurred, view the form and an error message.
        return res.render('/', {
          validationErrors: [error.message] || [error.errors.value.message],
          value: req.body.value
        })
      }
    } else {
      res.status(500).json({message: "No request body provided"})
    }
  }
    
    module.exports = catchController
    