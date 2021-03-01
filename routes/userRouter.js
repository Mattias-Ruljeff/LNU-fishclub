require("dotenv").config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const controller = require("../controller/userController");

// User router
router
  .get("/", controller.index)
  .post("/", controller.newUser)
  .delete("/", controller.deleteUser);

module.exports = router;
