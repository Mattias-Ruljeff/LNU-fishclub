var express = require("express");
var router = express.Router();

const controller = require("../controller/catchController")

/* GET users listing. */
router.get("/", controller.index);

module.exports = router;
