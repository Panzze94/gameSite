'use strict'

// Used libraries
var async = require('async');
var express = require('express');
var app = express();

/* Route for home page. */
router.get('/', function(req, res) {
  res.redirect('/game');
});

/* Route for game page*/
router.get('/', (req, res) => {
  res.render('index', {
    title: 'The game'
});
});
