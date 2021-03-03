var express = require("express");
var router = express.Router();

const controller = require("../controller/webhookCorntroller");
const authorize = require("../controller/authorizeController");

/* GET users listing. */
// router.get("/", authorize.checkToken, controller.index);
router
  .get("/", controller.index)
  .get("/subscribers", controller.getAllSubscribers)
  .post("/subscribers", controller.createSubscriber)
  .put("/subscribers", controller.updateOneSubscriber)
  .delete("/subscribers", controller.deleteOneSubscriber);

module.exports = router;
