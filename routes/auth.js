const passport = require("passport");

const auth = {
  required: (req, res, next) => {
    passport.authenticate("local", {
      failureRedirect: "/login"
    })(req, res, next);
  },
  optional: (req, res, next) => {
    next();
  }
};

module.exports = auth;
