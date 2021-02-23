var express = require("express");
const router = express.Router();

const controller = require("../controller/homeController")

/* GET home page. */
router.get("/", controller.index);
router.get("/logout", controller.logout);
router.post("/login", controller.login);

module.exports = router;
