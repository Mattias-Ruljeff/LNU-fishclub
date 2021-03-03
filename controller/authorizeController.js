"use strict";

/**
 * Authorization Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

require("dotenv").config();
const jwt = require("jsonwebtoken");
const { links } = require("../lib/hateoas");

const authController = {};

/**
 * Checks the Json web token.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
authController.checkToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null)
    return res.status(401).json({ error: "No token set", links: links(req) });

  try {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (error, user) => {
      if (error)
        return res.status(403).json({ error: error, links: links(req) });
      req.user = { username: user.data, token };
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Error when checking access-token" });
  }
};

module.exports = authController;
