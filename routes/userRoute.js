require("dotenv").config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const accessTokens = [];

const {
  createUser,
  checkUserInput,
  authenticate,
  checkToken,
} = require("../middleware/Authenticate");

router.get("/", function (req, res) {
  res.status(201).json({ message: "All users" });
});

router.post("/", checkUserInput, createUser, function (req, res) {
  res.status(201).json({ message: "User created" });
});

router.post("/login", checkUserInput, authenticate, function (req, res) {
  // Create JWT access token
  // const user = { name: req.body.username };

  const accessToken = jwt.sign(
    { name: req.body.username },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw Error(err);
      res.json({ token });
    }
  );

  accessTokens.push({
    username: req.body.username,
    accessToken: accessToken,
  });
  // res.json({ message: "User logged in", accessToken: accessToken });
});

router.get("/logged-in", checkToken, function (req, res) {
  console.log("logged in");
});

module.exports = router;
