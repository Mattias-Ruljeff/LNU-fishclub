var express = require("express");
var router = express.Router();

const controller = require("../controller/catchController");
const webhook = require("../controller/webhookController");
const authorize = require("../controller/authorizeController");

// Catch router

router
  .get("/", controller.index)
  .post(
    "/",
    authorize.checkToken,
    controller.logCatch,
    webhook.notifySubscribers
  )
  .put(
    "/",
    authorize.checkToken,
    controller.updateCatch,
    webhook.notifySubscribers
  )

  .get("/find/:catchId", controller.getOneCatch)

  .get("/from-one-user", controller.getOneUsersCatches)
  .delete(
    "/",
    authorize.checkToken,
    controller.deleteOneCatch,
    webhook.notifySubscribers
  );

module.exports = router;
