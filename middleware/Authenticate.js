require("dotenv").config();

const bcrypt = require("bcrypt");

const users = [];

function checkUserInput(req, res, next) {
  console.log("checking input");
  if (!req.body.username || req.body.username.length < 5)
    return res
      .status(411)
      .json({ error: "Enter a username that is longer than 3 characters" });
  if (!req.body.password || req.body.password.length < 7)
    return res
      .status(411)
      .json({ error: "Enter a password that is longer than 7 characters" });
  next();
}

async function authenticate(req, res, next) {
  console.log("authenticating");
  const user = users.find((user) => user.username === req.body.username);

  if (user) {
    try {
      console.log("authenticating, user exists");
      if (await bcrypt.compare(req.body.password, user.password)) {
        console.log("authenticating complete");
        next();
        return;
      } else {
        res.status(400).json({ message: "Username or password incorrect" });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error when logging in" });
    }
  } else {
    res.status(401).json({ error: "Username or password incorrect" });
  }
}

async function checkToken(req, res, next) {
  console.log(req.headers["authorization"]);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (token === null) return res.status(401).json({ error: "No token set" });
  try {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).json({ error: error });
      req.user = user.name;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Error when checking access-token" });
  }
}

module.exports = { checkUserInput, authenticate, createUser, checkToken };
