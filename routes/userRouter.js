"use strict";

require("dotenv").config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const controller = require("../controller/userController");
const authorize = require("../controller/authorizeController");

// User router

router
  .get("/", controller.index)
  .post("/", controller.newUser)

  .get("/logout/:username", authorize.checkToken, controller.logout)

  .post("/login", controller.login)

  .delete("/", controller.deleteUser)

  .get("/find/:username", controller.getUser)

  .get("/*", controller.error);

module.exports = router;
