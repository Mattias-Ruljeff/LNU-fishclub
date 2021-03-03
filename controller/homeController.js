"use strict";

/**
 * Home Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */
require("dotenv").config();
const { links, webhookLinks } = require("../lib/hateoas");

const homeController = {};

/**
 * Displays the URIs for the application.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
homeController.index = async (req, res) => {
  res.status(200).json({
    meta: {
      name: "LNU fish club",
      author: "Mattias Ruljeff",
      licence: "MIT",
      version: "1.0",
    },
    links: links(req),
  });
};

module.exports = homeController;
