var express = require("express");
var router = express.Router();

const controller = require("../controller/catchController");
const webhook = require("../controller/webhookCorntroller");
const authorize = require("../controller/authorizeController");

/* GET users listing. */
// router.get("/", authorize.checkToken, controller.index);
router
  .get("/", controller.index)
  .post(
    "/",
    authorize.checkToken,
    controller.logCatch,
    webhook.notifySubscribers
  )
  .put("/", authorize.checkToken, controller.updateCatch)

  .get("/find/:catchId", controller.getOneCatch)

  .get("/from-one-user", controller.getOneUsersCatches)
  .delete("/", authorize.checkToken, controller.deleteOneCatch);

module.exports = router;
