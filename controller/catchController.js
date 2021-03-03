/**
 * Catch Controller.
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
        return res.status(500).json({
          message: "Error when fetching catches",
          error,
          links: catchesLinks(req),
        });
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
    res.status(500).json({
      message: "Error when fetching catches",
      error,
      links: catchesLinks(req),
    });
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
          links: catchesLinks(req),
        });
      }
      if (oneCatch) {
        res.status(200).json({
          message: `Catch found!`,
          links: links(req),
          result: oneCatch,
        });
      } else {
        res
          .status(400)
          .json({ message: "No catch found", links: catchesLinks(req) });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error when fetching catches",
      links: catchesLinks(req),
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
  console.log(req.body);
  try {
    Catch.find({ username: `${req.body.username}` }, (err, catches) => {
      if (err) {
        res.status(400).json({
          message: "Error when fetching catches",
          err,
          links: catchesLinks(req),
        });
      }
      if (catches.length === 0) {
        res
          .status(200)
          .json({ message: "No cathes registered", links: catchesLinks(req) });
      } else {
        res.status(200).json({
          message: `All catches from user: ${req.body.username}`,
          links: catchesLinks(req),
          result: catches,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error when fetching catches",
      error,
      links: catchesLinks(req),
    });
  }
};

/**
 * Log a catch for a user in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.logCatch = async (req, res, next) => {
  if (req.body) {
    const {
      fishType,
      fishLength,
      fishWeight,
      longAndLatPos,
      city,
      lake,
    } = req.body;

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
      res.status(201).json({
        message: "Catch saved!",
        catchId: newCatch.id,
        links: catchesLinks(req),
      });
      next();
    } catch (error) {
      res.status(500).json({
        message: "Error when logging catch...",
        error: error.message,
        links: catchesLinks(req),
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
  console.log(req.body);
  if (req.body.id) {
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

      if (req.user.username === catchFromDB.username) {
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
                links: catchesLinks(req),
              });
            } else {
              res.status(200).json({
                message: `Catch ${id} updated!`,
                links: catchesLinks(req),
              });
            }
          }
        );
      } else {
        res.status(401).json({
          message: "User not authorized to change catch information",
          links: catchesLinks(req),
        });
      }
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      res.status(500).json({
        message: "Error when updating catch",
        error: error.message,
        links: catchesLinks(req),
      });
    }
  } else {
    res
      .status(500)
      .json({ message: "No request body provided", links: catchesLinks(req) });
  }
};

/**
 * Delete one cath in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.deleteOneCatch = async (req, res) => {
  console.log(req.body);
  if (req.body.id) {
    try {
      const { id, username } = req.body;
      console.log(id, "req.body.id");
      await Catch.findOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          return res.status(400).json({
            message: "Error while fetching catch",
            error: err,
            links: catchesLinks(req),
          });
        }

        // If the body is not providing all parameters, set the default values from the database.
        if (data) {
          console.log(data.username);
          if (req.user.username === data.username) {
            Catch.deleteOne({ _id: id }, (err) => {
              if (err) {
                res.status(500).json({
                  message: "Error when deleting catch",
                  error: err.message,
                  links: catchesLinks(req),
                });
              } else {
                res.status(200).json({
                  message: `Catch ${id} deleted`,
                  links: catchesLinks(req),
                });
              }
            });
          } else {
            res.status(401).json({
              message: "Error when deleting catch, username does not match",
              links: catchesLinks(req),
            });
          }
        } else {
          res.status(400).json({
            message: "Error when deleting catch, id not found",
            links: catchesLinks(req),
          });
        }
      });
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      return res.status(500).json({
        message: "Error when deleting catch",
        error: error.message,
        links: catchesLinks(req),
      });
    }
  } else {
    res.status(500).json({
      message: "No request body provided when deleding catch",
      links: catchesLinks(req),
    });
  }
};

module.exports = catchController;
