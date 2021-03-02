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

  .post("/login", controller.login)

  .delete(
    "/",
    authorize.checkToken,
    controller.checkUser,
    controller.deleteUser
  )

  .get("/find", controller.getUser)

  .get("/*", controller.error);

module.exports = router;
