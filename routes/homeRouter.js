var express = require("express");
const router = express.Router();

const controller = require("../controller/homeController");

// Home router
router
  .get("/", controller.index)

  .get("/logout", controller.logout)

  .post("/login", controller.login);

module.exports = router;
