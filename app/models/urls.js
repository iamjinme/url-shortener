'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Url = new Schema({
  original: String,
  short: String
});

module.exports = mongoose.model('Url', Url);
