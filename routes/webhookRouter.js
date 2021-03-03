var express = require("express");
var router = express.Router();

const controller = require("../controller/webhookController");
const authorize = require("../controller/authorizeController");

// Webhook router

router
  .get("/", controller.index)
  .get("/subscribers", controller.getAllSubscribers)
  .post("/subscribers", controller.createSubscriber)
  .put("/subscribers", controller.updateOneSubscriber)
  .delete("/subscribers", controller.deleteOneSubscriber);

module.exports = router;
