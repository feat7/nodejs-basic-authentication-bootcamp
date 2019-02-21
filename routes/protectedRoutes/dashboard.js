const express = require("express");
const auth = require("../auth");

const router = express.Router();

router.post("/", (req, res, next) => {
  res.send("Hello world! welcome to dashboard");
});

module.exports = router;
