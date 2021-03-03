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
  .post("/", controller.checkUser, controller.newUser)
  .delete(
    "/",
    authorize.checkToken,
    controller.checkUser,
    controller.deleteUser
  )

  .post("/login", controller.login)

  .get("/find", controller.getUser);

module.exports = router;
