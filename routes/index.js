const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('----------- Inside home route ---------');
  console.log(req.sessionID);
  res.render('index', { title: 'Express' });
});

module.exports = router;
