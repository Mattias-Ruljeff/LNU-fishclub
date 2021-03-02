/**
 * Webhook Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

"use strict";
require("dotenv").config();
const WebHook = require("../models/webbHooks");

const webhookController = {};

/**
 * Gets all the current catches.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
webhookController.index = async (req, res) => {
  WebHook.find({}, (err, hooks) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error when fetching webhook url-list", error: err });
    }
    res.status(200).json({ message: "All url-hooks fetched", hooks });
  });
};

webhookController.createSubscriber = async (req, res) => {
  try {
    const newSubscriber = new WebHook({
      url: req.body.url,
    });
    await newSubscriber.save();
    res.status(201).json({ message: "New subscriber added to webhook!" });
  } catch (error) {
    res.status(500).json({
      message: "Error when creating new webhook subscriber",
      error: error,
    });
  }
};

webhookController.createSubscriber = async (req, res) => {
  WebHook.find({}, (err, hooks) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error when fetching webhook url-list", error: err });
    }
    res.status(200).json({ message: "All url-hooks fetched", hooks });
  });
};

module.exports = webhookController;
