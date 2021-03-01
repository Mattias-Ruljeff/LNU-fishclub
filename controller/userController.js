/**
 * New user Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

"use strict";

const User = require("../models/userModel");

const newuserController = {};

/**
 * Displays the new user page.
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
      res.status(200).json({ message: "All users", allUsers });
    } else {
      res.status(500).json({ message: "Error while getting all users" });
    }
  });
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
 * Deletes the created user to the DB.
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

module.exports = newuserController;
