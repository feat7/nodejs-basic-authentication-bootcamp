const express = require("express");

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Node.js Bootcamp" });
});

router.use("/dashboard", require("./protectedRoutes/dashboard"));

module.exports = router;
