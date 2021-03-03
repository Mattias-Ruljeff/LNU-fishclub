"use strict";

/**
 * User Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const { usersLinks } = require("../lib/hateoas");

const newuserController = {};

/**
 * Fetches all users in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
newuserController.index = async (req, res) => {
  User.find({}, (err, users) => {
    if (err)
      res.status(400).json({ message: "Error while fetching users", err });
    if (users) {
      let allUsers = [];
      users.map((user) => {
        allUsers.push({ username: user.username });
      });
      res.status(200).json({
        message: "All users fetched!",
        links: usersLinks(req),
        result: allUsers,
      });
    } else {
      res.status(500).json({ message: "Error while fetching all users" });
    }
  });
};

/**
 * Login user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
newuserController.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const compare = await user.comparePassword(req.body.password);
      if (user && compare) {
        const token = jwt.sign(
          {
            data: req.body.username,
          },
          process.env.JWT_TOKEN_SECRET,
          { expiresIn: 1800 } // 30 minutes.
        );
        res.status(200).json({ message: "User logged in!", token });
      } else {
        res.status(400).json({ message: "Username or password incorrect" });
      }
    } else {
      res.status(400).json({ message: "User not found!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error when logging in", error: error.message });
  }
};

/**
 * Fetch one user in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
newuserController.getUser = async (req, res) => {
  console.log(req.body);
  try {
    User.findOne({ username: req.body.username }, (error, user) => {
      if (error)
        res.status(400).json({
          message: "Error when fetching user",
          error,
          links: usersLinks(req),
        });
      if (user) {
        res.status(200).json({
          message: "User found!",
          links: usersLinks(req),
          result: { id: user.id, username: user.username },
        });
      } else {
        res
          .status(400)
          .json({ message: "User not found..", links: usersLinks(req) });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error when fetching user",
      error: error,
      message,
    });
  }
};

/**
 * Checks if the user exists in the database.
 *
 * Middleware.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
newuserController.checkUser = async (req, res, next) => {
  console.log(req.body);
  try {
    User.findOne({ username: req.body.username }, (error, user) => {
      if (error)
        res.status(400).json({
          message: "Error when fetching users",
          error,
          links: usersLinks(req),
        });
      if (user) {
        next();
      } else {
        res
          .status(400)
          .json({ message: "User not found", links: usersLinks(req) });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error when getting user",
      error: error,
      links: usersLinks(req),
    });
  }
};

/**
 * Saves the created user to the DB.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
newuserController.newUser = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    await user.save();
    res.status(201).json({ message: "User created!", links: usersLinks(req) });
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    res.status(500).json({
      message: "Error while creating user...",
      error: error.message,
      links: usersLinks(req),
    });
  }
};

/**
 * Deletes one user in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
newuserController.deleteUser = async (req, res) => {
  try {
    User.findOneAndDelete({ username: req.body.username }, (error) => {
      if (error) {
        res.status(400).json({
          message: "Error when deleting user",
          error: error,
          links: usersLinks(req),
        });
      }
      res.status(200).json({ message: "User deleted", links: usersLinks(req) });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting user...",
      error: error.message,
      links: usersLinks(req),
    });
  }
};

module.exports = newuserController;
