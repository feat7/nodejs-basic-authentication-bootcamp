const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const mainRouter = require("./routes/index");
const usersRouter = require("./routes/users");

mongoose.Promise = global.Promise;

// User Model
const User = require("./models/User");

mongoose
  .connect("mongodb://localhost:27017/nodesetup", {
    useNewUrlParser: true
  })
  .then(() => console.log("connection successful"))
  .catch(err => console.error(err));

// configure passport.js to use the local strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    return User.findOne({ email })
      .then(user => {
        return done(null, user.validatePassword(password));
      })
      .catch(e => {
        console.log(e.message);
        done(null, false);
      });
  })
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "somesecretkey" }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", mainRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
