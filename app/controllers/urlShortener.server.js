'use strict';

var ys = require('ys-hash');
var Urls = require('../models/urls.js');
ys.set_mask_len(70);

function URLShortener() {
  
  this.isURL = function(value) {
    var expression = '';
    var regex = new RegExp(expression);
    return value.match(regex);
  };
  
  this.countURL = function() {
    Urls.count({}, function( err, count){
      return count;
    });
  };
  
  this.getURL = function(req, res) {
    var url = '/';
    console.log(req.params.hash)
    Urls.findOne({ 'hash': req.params.hash }, { '_id': false }, function(err, result) {
      if (err) { throw err; }
      if (result) url = result.original;
      res.redirect(url);
    });
  };
  
  this.addURL = function(req, res, prefix) {
    var uri = (prefix || '') + req.params.url;
    var hash = ys.hash(uri);
    console.log(uri, hash);
    var url = {
      "original": uri,
      "hash": hash
    }
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
		Urls.findOneAndUpdate({ 'hash': hash }, url, options, function(err, result) {
			if (err) { throw err; }
      res.json(result);
    });
  };
  
};

module.exports = URLShortener;
