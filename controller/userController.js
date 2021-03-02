/**
 * User Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

"use strict";

const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const { usersLinks } = require("../lib/hateoas");

const newuserController = {};

/**
 * Finds all users in DB.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
newuserController.index = async (req, res) => {
  const allUsers = User.find({}, (err, users) => {
    if (err)
      res.status(400).json({ message: "Error while fetching users", err });
    if (users) {
      let allUsers = [];
      users.map((user) => {
        allUsers.push({ username: user.username });
      });
      res.status(200).json({
        message: "All users",
        links: usersLinks(req),
        result: allUsers,
      });
    } else {
      res.status(500).json({ message: "Error while getting all users" });
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
      console.log(compare);
      if (user && compare) {
        const token = jwt.sign(
          {
            data: req.body.username,
          },
          process.env.JWT_TOKEN_SECRET,
          { expiresIn: 1800 }
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

newuserController.logout = async (req, res) => {
  res.json({ msg: "Logged out" });
};

/**
 * Fetch one user in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
newuserController.getUser = async (req, res) => {
  try {
    User.findOne({ username: req.params.username }, (err, user) => {
      if (err)
        res.status(400).json({ message: "Error when fetching users", err });
      if (user) {
        res.status(200).json({
          message: "User found",
          links: usersLinks(req),
          result: { username: user.username, createdAt: user.createdAt },
        });
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
      message,
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
    res.status(201).json({ message: "User created!" });
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    res
      .status(500)
      .json({ message: "Error while creating user...", error: error.message });
  }
};

/**
 * Deletes one user in the DB.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
newuserController.deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ username: req.body.username });
    res.status(201).json({ message: "User deleted." });
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    res
      .status(500)
      .json({ message: "Error while creating user...", error: error.message });
  }
};

newuserController.error = async (req, res) => {
  res.status(404).json({ message: "Not found", links: usersLinks(req) });
};

module.exports = newuserController;
