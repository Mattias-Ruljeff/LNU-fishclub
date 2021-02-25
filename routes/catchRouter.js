var express = require("express");
var router = express.Router();

const controller = require("../controller/catchController")
const authorize = require("../controller/authorizeController")

/* GET users listing. */
router.get("/", authorize.check, controller.index);

module.exports = router;
