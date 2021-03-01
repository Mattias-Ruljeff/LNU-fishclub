/**
 * New catch Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

"use strict";

const Catch = require("../models/catchModel");
const { links, catchesLinks } = require("../lib/hateoas");

const catchController = {};

/**
 * Gets all the current catches from the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.index = async (req, res) => {
  try {
    Catch.find({}, (error, catches) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error when fetching catches", error });
      }
      if (catches.length > 0) {
        res.status(200).json({
          message: "All catches from database",
          links: catchesLinks(req),
          result: catches,
        });
      } else {
        res.status(200).json({
          message: "No catches registered",
          links: catchesLinks(req),
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error when fetching catches", error });
  }
};

/**
 * Get one catch from the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.getOneCatch = async (req, res) => {
  try {
    Catch.findById({ _id: req.params.catchId }, (err, oneCatch) => {
      if (err) {
        return res.status(400).json({
          message: "Error when fetching catch, id not available",
          err,
        });
      }
      res.status(200).json({
        message: `Catch found!`,
        links: links(req),
        result: oneCatch,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error when fetching catches",
      links: catchesLinks,
      error: error,
    });
  }
};

/**
 * Get one users catches from the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.getOneUsersCatches = async (req, res) => {
  try {
    Catch.find({ username: `${req.params.username}` }, (err, catches) => {
      if (err) {
        res.status(400).json({ message: "Error when fetching catches", err });
      }
      if (catches.length === 0) {
        res.status(200).json({ message: "No cathes registered" });
      } else {
        res.status(200).json({
          message: `All catches from user: ${req.params.username}`,
          result: catches,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error when fetching catches", error });
  }
};

/**
 * Log a catch for a user in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.logCatch = async (req, res) => {
  if (req.body) {
    const {
      fishType,
      fishLength,
      fishWeight,
      longAndLatPos,
      city,
      lake,
    } = req.body;
    console.log(req.user);

    try {
      const newCatch = new Catch({
        username: req.user.username,
        fishType: fishType,
        fishLength: fishLength,
        fishWeight: fishWeight,
        longAndLatPos: longAndLatPos,
        city: city,
        lake: lake,
      });
      await newCatch.save();
      res.status(201).json({ message: "Catch saved!" });
    } catch (error) {
      res.status(500).json({
        message: "Error when logging catch...",
        error: error.message,
      });
    }
  }
};

/**
 * Update one cath in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.updateCatch = async (req, res) => {
  if (req.body.id && req.body.username) {
    try {
      const catchFromDB = await Catch.findById(req.body.id, (err, doc) => {
        if (err) {
          res.status(400).json({ message: "Error when finding catch", err });
        }
      });

      // If the body is not providing all parameters, set the default values from the database.
      const {
        id,
        username,
        fishType = catchFromDB.fishType,
        fishLength = catchFromDB.fishLength,
        fishWeight = catchFromDB.fishWeight,
        longAndLatPos = catchFromDB.longAndLatPos,
        city = catchFromDB.city,
        lake = catchFromDB.lake,
      } = req.body;

      if (username === catchFromDB.username) {
        Catch.findByIdAndUpdate(
          id,
          {
            username: catchFromDB.username,
            fishType: fishType,
            fishLength: fishLength,
            fishWeight: fishWeight,
            longAndLatPos: longAndLatPos,
            city: city,
            lake: lake,
          },
          { new: true, useFindAndModify: false },
          function (err, doc, result) {
            if (err) {
              res.status(400).json({
                message: "Error when updating catch",
                error: err.message,
              });
            } else {
              res.status(200).json({ message: `Catch ${id} updated!` });
            }
          }
        );
      }
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      res
        .status(500)
        .json({ message: "Error when updating catch", error: error.message });
    }
  } else {
    res.status(500).json({ message: "No request body provided" });
  }
};

/**
 * Delete one cath in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.deleteOneCatch = async (req, res) => {
  if (req.body.id && req.body.username) {
    try {
      const { id, username } = req.body;
      console.log(id, "req.body.id");
      const catchFromDB = await Catch.findOne(
        { _id: req.body.id },
        (err, data) => {
          if (err) {
            return res
              .status(400)
              .json({ message: "Error while fetching catch", error: err });
          }

          // If the body is not providing all parameters, set the default values from the database.
          if (data) {
            console.log(data.username);
            if (username === data.username) {
              Catch.deleteOne({ _id: id }, (err) => {
                if (err) {
                  res.status(500).json({
                    message: "Error when deleting catch",
                    error: err.message,
                  });
                } else {
                  res.status(200).json({ message: `Catch ${id} deleted` });
                }
              });
            } else {
              res.status(401).json({
                message: "Error when deleting catch, username does not match",
              });
            }
          } else {
            res.status(400).json({
              message: "Error when deleting catch, id not found",
            });
          }
        }
      );
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      return res
        .status(500)
        .json({ message: "Error when deleting catch", error: error.message });
    }
  } else {
    res
      .status(500)
      .json({ message: "No request body provided when deleding catch" });
  }
};

module.exports = catchController;
