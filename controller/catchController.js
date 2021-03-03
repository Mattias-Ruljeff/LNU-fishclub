"use strict";

/**
 * Catch Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */
const Catch = require("../models/catchModel");
const { catchesLinks } = require("../lib/hateoas");

const catchController = {};

/**
 * Gets all the saved catches from the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.index = async (req, res) => {
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
};

/**
 * Get one saved catch from the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.getOneCatch = async (req, res) => {
  Catch.findById({ _id: req.params.catchId }, (error, oneCatch) => {
    if (error) {
      return res.status(400).json({
        message: "Error when fetching catch, id not available",
        error,
        links: catchesLinks(req),
      });
    }
    if (oneCatch) {
      res.status(200).json({
        message: `Catch found!`,
        links: catchesLinks(req),
        result: oneCatch,
      });
    } else {
      res
        .status(400)
        .json({ message: "No catch found", links: catchesLinks(req) });
    }
  });
};

/**
 * Get one users saved catches from the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.getOneUsersCatches = async (req, res) => {
  Catch.find({ username: `${req.body.username}` }, (error, catches) => {
    if (error) {
      res.status(400).json({
        message: "Error when fetching one users catches",
        error,
        links: catchesLinks(req),
      });
    }
    if (catches.length === 0) {
      res.status(200).json({
        message: "No cathes registered to the user",
        links: catchesLinks(req),
      });
    } else {
      res.status(200).json({
        message: `All catches from user: ${req.body.username}`,
        links: catchesLinks(req),
        result: catches,
      });
    }
  });
};

/**
 * Save a catch for a user to the database.
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
        message: "Error when saving catch...",
        error: error.message,
        links: catchesLinks(req),
      });
    }
  }
};

/**
 * Update one catch in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.updateCatch = async (req, res) => {
  if (req.body.id) {
    try {
      const catchFromDB = await Catch.findById(req.body.id, (err, doc) => {
        if (err) {
          res.status(400).json({
            message: "Error when finding catch",
            err,
            links: catchesLinks(req),
          });
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
          (error, doc, result) => {
            if (error) {
              res.status(400).json({
                message: "Error when updating catch",
                error: error.message,
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
 * Delete one catch in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.deleteOneCatch = async (req, res) => {
  if (req.body.id) {
    try {
      const { id } = req.body;
      await Catch.findOne({ _id: id }, (error, catchFromDb) => {
        if (error) {
          return res.status(400).json({
            message: "Error when deleting catch",
            error,
            links: catchesLinks(req),
          });
        }

        // If the body is not providing all parameters, set the default values from the database.
        if (catchFromDb) {
          if (req.user.username === catchFromDb.username) {
            Catch.deleteOne({ _id: id }, (error) => {
              if (error) {
                res.status(500).json({
                  message: "Error when deleting catch",
                  error: error.message,
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
            message: "Error when deleting catch, catch id not found",
            links: catchesLinks(req),
          });
        }
      });
    } catch (error) {
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
