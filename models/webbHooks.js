/**
 * User schema.
 *
 * @author Mattias Ruljeff
 * @version 1.0
 */

"use strict";

const mongoose = require("mongoose");

// The schema for creating a new user.
const HookSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const WebHook = mongoose.model("Webhook", HookSchema);

module.exports = WebHook;
