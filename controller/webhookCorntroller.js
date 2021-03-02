/**
 * Webhook Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

"use strict";
require("dotenv").config();
const fetch = require("node-fetch");
const WebHook = require("../models/webbHooks");

const webhookController = {};

/**
 * Gets all the current catches.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
webhookController.index = async (req, res) => {
  WebHook.find({}, (error, hooks) => {
    if (error) {
      return res.status(400).json({
        message: "error when fetching webhook url-list",
        error: error,
      });
    }
    res.status(200).json({ message: "All url-hooks fetched", hooks });
  });
};

webhookController.createSubscriber = async (req, res) => {
  try {
    WebHook.findOne({ url: req.body.url }, async (error, subscriber) => {
      if (error) {
        return res.status(400).json({
          message: "error while adding subscriber",
          error: error,
        });
      }
      if (subscriber) {
        return res
          .status(403)
          .json({ message: "Wehook subscriber already listed." });
      }
      const newSubscriber = new WebHook({
        url: req.body.url,
      });
      await newSubscriber.save();
      res.status(201).json({ message: "New subscriber added to webhook!" });
    });
  } catch (error) {
    res.status(500).json({
      message: "error when creating new webhook subscriber",
      error: error,
    });
  }
};

webhookController.notifySubscribers = async (req, res) => {
  try {
    console.log(JSON.stringify(req.body.message));
    WebHook.find({}, (error, hooks) => {
      if (error) {
        return res.status(400).json({
          message: "Error when fetching webhook url-list, notify subscribers",
          error: error,
        });
      }

      hooks.forEach(({ url }) => {
        console.log(url);
        fetch(url, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(req.body.message),
        })
          .then(console.log("sent"))
          .catch((error) =>
            res.status(500).json({
              message: "Error when posting to subscriber",
              error: error,
            })
          );
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while notifying subscribers", error: error });
  }
};

module.exports = webhookController;
