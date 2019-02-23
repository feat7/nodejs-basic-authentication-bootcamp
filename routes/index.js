const express = require("express");

const Note = require('../models/Note');

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  Note.find().then(results => {
    res.render("test", { results });
  }).catch(e => console.log('Some error occured'));
});

/* GET add page. */
router.get("/add", (req, res) => {
  res.render("addnote");
});

/* POST add page. */
router.post("/add", (req, res) => {
  
});

router.use("/dashboard", require("./protectedRoutes/dashboard"));

module.exports = router;
