var express = require('express');
var router = express.Router();

/* Route for home page. */
router.get('/', function(req, res) {
  res.redirect('/game');
});

module.exports = router;
