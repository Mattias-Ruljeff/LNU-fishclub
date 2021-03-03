const express = require("express");
const logger = require("morgan");
require("dotenv").config();

const mongoose = require("./config/database");

const homeRouter = require("./routes/homeRouter");
const catchRouter = require("./routes/catchRouter");
const userRouter = require("./routes/userRouter");
const webhookRouter = require("./routes/webhookRouter");

const { links } = require("./lib/hateoas");

const app = express();
const port = 3000;

mongoose.connect().catch((error) => {
  console.log(error);
  process.exit(1);
});

app.use(logger("dev"));
app.use(express.json());

app.use("/api/v1", homeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/catches", catchRouter);
app.use("/api/v1/webhook", webhookRouter);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Recource not found", links: links(req) });
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Example app listening at http://localhost:${process.env.PORT || port}`
  );
});

module.exports = app;
