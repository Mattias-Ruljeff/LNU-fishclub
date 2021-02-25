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
 * Checks the Json web token.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
catchController.check = async (req, res) => {
  console.log(req.headers["authorization"]);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (token === null) return res.status(401).json({ error: "No token set" });
  try {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).json({ error: error });
      req.user = user.name;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Error when checking access-token" });
  }
}

module.exports = catchController
