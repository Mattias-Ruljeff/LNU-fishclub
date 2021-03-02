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
const { webhookLinks } = require("../lib/hateoas");

const webhookController = {};

/**
 * Gets all the current catches.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
webhookController.index = async (req, res) => {
  res.status(200).json({
    message: "Webhook",
    links: webhookLinks(req),
  });
};

webhookController.getAllSubscribers = async (req, res) => {
  WebHook.find({}, (error, hooks) => {
    if (error) {
      return res.status(400).json({
        message: "error when fetching webhook url-list",
        error: error,
      });
    }
    res
      .status(200)
      .json({
        message: "All webhook subscribers fetched",
        links: webhookLinks(req),
        result: hooks,
      });
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

webhookController.notifySubscribers = async (req, res, next) => {
  try {
    console.log("Notifications sending...");
    WebHook.find({}, (error, subscribers) => {
      if (error) {
        return res.status(400).json({
          message: "Error when fetching webhook url-list, notify subscribers",
          error: error,
        });
      }
      if (subscribers.length >= 0) {
        subscribers.forEach(({ url }) => {
          fetch(url, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(req.body),
          }).catch((error) =>
            res.status(500).json({
              message: "Error when posting to subscriber",
              error: error,
            })
          );
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while notifying subscribers", error: error });
  }
};

webhookController.deleteOneSubscriber = async (req, res) => {
  if (req.body.id) {
    try {
      const { id } = req.body;
      WebHook.findOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          return res.status(400).json({
            message: "Error while checking webhook subscribers",
            error: err,
          });
        }

        if (data) {
          WebHook.deleteOne({ _id: id }, (err) => {
            if (err) {
              res.status(500).json({
                message: "Error when deleting webhook subscriber",
                error: err.message,
              });
            } else {
              res
                .status(200)
                .json({ message: `Webhook subscriber ${id} deleted` });
            }
          });
        } else {
          res.status(400).json({
            message: "Error when deleting webhook subscriber, id not found",
          });
        }
      });
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      return res.status(500).json({
        message: "Error when deleting webhook subscriber",
        error: error.message,
      });
    }
  } else {
    res.status(500).json({
      message: "No request body provided when deleding webhook subscriber",
    });
  }
};

webhookController.updateOneSubscriber = async (req, res) => {
  if (req.body.id && req.body.url) {
    try {
      const { id, url } = req.body;
      WebHook.findByIdAndUpdate({ _id: id }, { url: url }, (err) => {
        if (err) {
          return res.status(400).json({
            message: "Error while checking webhook subscribers",
            error: err,
          });
        }
      });
      res.status(200).json({ message: "Webhook subscriber updated!" });
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      return res.status(500).json({
        message: "Error when deleting webhook subscriber",
        error: error.message,
      });
    }
  } else {
    res.status(500).json({
      message: "No request body provided when deleding webhook subscriber",
    });
  }
};

module.exports = webhookController;
