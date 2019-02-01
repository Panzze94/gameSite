var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PlayerSchema = new Schema(
  {
    nickname: {type: String, required: true, max: 100},
    date_of_game: {type: Date},
    score: {type: Number}
  }
);

// Virtual for player's full name
PlayerSchema
.virtual('name')
.get(function () {
  return this.nickname;
});

// Virtual for player's lifespan
PlayerSchema
.virtual('last high score')
.get(function () {
  var lastGame = this.date_of_game;
  return lastGame;
});

// Virtual for player's URL
PlayerSchema
.virtual('url')
.get(function () {
  return '/scoreBoard/player/' + this._id;
});

//Export model
module.exports = mongoose.model('Player', PlayerSchema);
