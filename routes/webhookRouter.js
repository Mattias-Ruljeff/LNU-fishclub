var express = require("express");
var router = express.Router();

const controller = require("../controller/webhookCorntroller");
const authorize = require("../controller/authorizeController");

/* GET users listing. */
// router.get("/", authorize.checkToken, controller.index);
router
  .get("/", controller.index)
  .post("/", controller.createSubscriber)
  .post("/notify-subscribers", controller.notifySubscribers);

module.exports = router;
