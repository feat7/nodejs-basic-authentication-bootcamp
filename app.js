const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const uuid = require("uuid/v4");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FileStore = require("session-file-store")(session);

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
      .catch(e => done(null, false));
  })
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// session
app.use(
  session({
    genid: () => {
      return uuid();
    },
    store: new FileStore(),
    secret: "Some seceret key.",
    resave: false,
    saveUninitialized: true
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
