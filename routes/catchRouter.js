var express = require("express");
var router = express.Router();

const controller = require("../controller/catchController")
const authorize = require("../controller/authorizeController")

/* GET users listing. */
// router.get("/", authorize.check, controller.index);
router.get("/", controller.index);
router.post("/", controller.logCatch);

module.exports = router;
