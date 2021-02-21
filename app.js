const express = require("express");
const logger = require("morgan");

require("dotenv").config();

const indexRouter = require("./routes/indexRouter");
const fishRouter = require("./routes/fishRouter");
const loginRouter = require("./routes/userRoute");

const app = express();
const port = 3000;

// view engine setup

app.use(logger("dev"));
app.use(express.json());

app.use("/", indexRouter);
app.use("/users", loginRouter);
app.use("/fish", fishRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
