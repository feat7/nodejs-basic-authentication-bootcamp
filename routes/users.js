const express = require("express");
const passport = require("passport");

const User = require("../models/User");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

// Route for login
router.get("/login", (req, res, next) => {
  res.render("login");
});

// Route for login lgoic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login"
  })
);

// Route for login
router.get("/register", (req, res, next) => {
  res.render("register");
});

// Route for register lgoic
router.post("/register", (req, res, next) => {
  const userDetail = {
    email: req.body.email,
    password: req.body.password
  };
  const finalUser = new User(userDetail);

  return finalUser
    .save()
    .then(user => res.json({ user }))
    .catch(e =>
      res.status(422).json({
        error: e.message
      })
    );
});

module.exports = router;
