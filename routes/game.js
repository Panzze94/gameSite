var express = require('express');
var router = express.Router();

/* Route for game page*/
router.get('/', (req, res) => {
  res.render('index', {
    title: 'The game'
});
});

module.exports = router;
