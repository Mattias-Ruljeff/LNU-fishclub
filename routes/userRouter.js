require("dotenv").config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const controller = require("../controller/userController")

router.get("/", controller.index)
.post("/", controller.newUser)

module.exports = router;
