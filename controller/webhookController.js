"use strict";

/**
 * Webhook Controller.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */
require("dotenv").config();
const fetch = require("node-fetch");
const WebHook = require("../models/webbHooksModel");
const { webhookLinks } = require("../lib/hateoas");

const webhookController = {};

/**
 * Displays the URIs for the webhook.
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

/**
 * Fetches all the subscribers for the webhook from the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
webhookController.getAllSubscribers = async (req, res) => {
  WebHook.find({}, (error, hooks) => {
    if (error) {
      return res.status(400).json({
        message: "error when fetching webhook url-list",
        error: error,
        links: webhookLinks(req),
      });
    }
    res.status(200).json({
      message: "All webhook subscribers fetched",
      links: webhookLinks(req),
      result: hooks,
    });
  });
};

/**
 * Saves a subscribers for the webhook to the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
webhookController.createSubscriber = async (req, res) => {
  try {
    WebHook.findOne({ url: req.body.url }, async (error, subscriber) => {
      if (error) {
        return res.status(400).json({
          message: "Error when adding subscriber",
          error: error,
          links: webhookLinks(req),
        });
      }
      if (subscriber) {
        return res.status(403).json({
          message: "Wehook subscriber already listed.",
          links: webhookLinks(req),
        });
      }
      const newSubscriber = new WebHook({
        url: req.body.url,
      });
      await newSubscriber.save();
      res.status(201).json({
        message: "New subscriber added to webhook!",
        subscriberId: newSubscriber.id,
        links: webhookLinks(req),
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "error when creating new webhook subscriber",
      error: error,
      links: webhookLinks(req),
    });
  }
};

/**
 * Updates one subscriber for the webhook in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
webhookController.updateOneSubscriber = async (req, res) => {
  if (req.body.id && req.body.url) {
    try {
      const { id, url } = req.body;
      WebHook.findByIdAndUpdate({ _id: id }, { url: url }, (error) => {
        if (error) {
          return res.status(400).json({
            message: "Error while finding webhook subscribers to update",
            error,
            links: webhookLinks(req),
          });
        }
      });
      res.status(200).json({
        message: "Webhook subscriber updated!",
        links: webhookLinks(req),
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error when updating webhook subscriber",
        error: error.message,
        links: webhookLinks(req),
      });
    }
  } else {
    res.status(500).json({
      message: "No request body provided when updating webhook subscriber",
      links: webhookLinks(req),
    });
  }
};

/**
 * Notifies all subscribers for the webhook listed in the database.
 *
 * Middleware.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
webhookController.notifySubscribers = async (req, res, next) => {
  try {
    WebHook.find({}, (error, subscribers) => {
      if (error) {
        return res.status(400).json({
          message: "Error when fetching webhook url-list, notify subscribers",
          error: error,
          links: webhookLinks(req),
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
              links: webhookLinks(req),
            })
          );
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while notifying subscribers",
      error: error,
      links: webhookLinks(req),
    });
  }
};

/**
 * Deletes one subscriber for the webhook in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
webhookController.deleteOneSubscriber = async (req, res) => {
  if (req.body.id) {
    try {
      const { id } = req.body;
      WebHook.findOne({ _id: id }, (error, data) => {
        if (error) {
          return res.status(400).json({
            message: "Error when finding webhook subscribers to delete",
            error,
            links: webhookLinks(req),
          });
        }

        if (data) {
          WebHook.deleteOne({ _id: id }, (error) => {
            if (error) {
              res.status(500).json({
                message: "Error when deleting webhook subscriber",
                error: error.message,
                links: webhookLinks(req),
              });
            } else {
              res.status(200).json({
                message: `Webhook subscriber ${id} deleted`,
                links: webhookLinks(req),
              });
            }
          });
        } else {
          res.status(400).json({
            message: "Error when deleting webhook subscriber, id not found",
            links: webhookLinks(req),
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error when deleting webhook subscriber",
        error: error.message,
        links: webhookLinks(req),
      });
    }
  } else {
    res.status(500).json({
      message: "No request body provided when deleting webhook subscriber",
      links: webhookLinks(req),
    });
  }
};

module.exports = webhookController;
