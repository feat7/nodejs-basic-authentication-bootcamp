const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const sassMiddleware = require("node-sass-middleware");

const mainRouter = require("./routes/index");
const usersRouter = require("./routes/users");

mongoose.Promise = global.Promise;

// User Model
const User = require("./models/User");

// mongoose
//   .connect("mongodb://localhost:27017/nodesetup", {
//     useNewUrlParser: true
//   })
//   .then(() => console.log("connection successful"))
//   .catch(err => console.error(err));

  //Set up default mongoose connection
var mongoDB = 'mongodb://webdev:webdev1234@ds349045.mlab.com:49045/webdevbootcamp';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

app.use(session({ secret: "somesecretkey" }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  sassMiddleware({
    /* Options */
    src: path.join(__dirname, "sass"),
    dest: path.join(__dirname, "public", "stylesheets"),
    debug: true,
    outputStyle: "compressed",
    prefix: "/stylesheets"
  })
);
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
