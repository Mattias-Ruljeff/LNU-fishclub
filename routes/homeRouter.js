var express = require("express");
const router = express.Router();

const controller = require("../controller/homeController");

// Home router
router.get("/", controller.index);

module.exports = router;
