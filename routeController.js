'use strict'

// Used libraries
var async = require('async');
var express = require('express');
var app = express();

//listen to the port 8080 or user's choice in terminal
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

//we use pug in views
app.set('view engine', 'pug');

/* Route for home page. */
app.get('/', function(req, res) {
  res.render('game');
});

app.get('/submit', (req, res) => {
  res.render('submit');
});

/* Route for scoreboard page*/
app.get('/scoreBoard', (req, res) => {
  res.render('scoreBoard');
});


//use libraries, js and css- files etc
app.use(express.static(__dirname + '/public'));
