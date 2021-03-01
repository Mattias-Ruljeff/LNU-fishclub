var express = require("express");
var router = express.Router();

const controller = require("../controller/catchController");
const authorize = require("../controller/authorizeController");

/* GET users listing. */
// router.get("/", authorize.checkToken, controller.index);
router
  .get("/", controller.index)
  .post("/", authorize.checkToken, controller.logCatch)
  .put("/", authorize.checkToken, controller.updateCatch)

  .get("/find/:catchId", controller.getOneCatch)

  .get("/:username", controller.getOneUsersCatches)
  .delete("/", authorize.checkToken, controller.deleteOneCatch);

module.exports = router;
