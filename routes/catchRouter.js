var express = require("express");
var router = express.Router();

const controller = require("../controller/catchController")
const authorize = require("../controller/authorizeController")

/* GET users listing. */
// router.get("/", authorize.check, controller.index);
router.get("/", controller.index)
.post("/", controller.logCatch)
.put("/", controller.updateCatch);

router.get("/:username", controller.getOneUsersCatches)



module.exports = router;
