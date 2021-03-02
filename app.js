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

var http, options, proxy, url;

http = require("http");

url = require("url");

proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL);
target = url.parse("https://lnu-fishclub.herokuapp.com/");

options = {
  hostname: proxy.hostname,
  port: proxy.port || 80,
  path: target.href,
  headers: {
    "Proxy-Authorization": "Basic " + new Buffer(proxy.auth).toString("base64"),
    Host: target.hostname,
  },
};

http.get(options, function (res) {
  res.pipe(process.stdout);
  return console.log("status code", res.statusCode);
});

mongoose.connect().catch((error) => {
  console.log(error);
  process.exit(1);
});

// view engine setup

app.use(logger("dev"));
app.use(express.json());

app.use("/api/v1", homeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/catches", catchRouter);
app.use("/api/v1/webhook", webhookRouter);
app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Not found", links: links(req) });
});
console.log(process.env.NODE_ENV);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("EEERRROOOORRR");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Example app listening at http://localhost:${process.env.PORT || port}`
  );
});

module.exports = app;
