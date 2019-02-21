const express = require("express");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

// Route for login
router.get("/login", (req, res, next) => {
  res.send("Login form here");
});

// Route for login lgoic
router.post("/login", (req, res, next) => {
  res.send("Login logic here");
});

module.exports = router;
