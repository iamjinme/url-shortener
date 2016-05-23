'use strict';

var ys = require('ys-hash');
var Urls = require('../models/urls.js');
ys.set_mask_len(70);

function URLShortener() {
  
  this.isURL = function(value) {
    var expression = /(([\w\.\-\+]+:)\/{2}(([\w\d\.]+):([\w\d\.]+))?@?(([a-zA-Z0-9\.\-_]+)(?::(\d{1,5}))?))?(\/(?:[a-zA-Z0-9\.\-\/\+\%]+)?)(?:\?([a-zA-Z0-9=%\-_\.\*&;]+))?(?:#([a-zA-Z0-9\-=,&%;\/\\"'\?]+)?)?/g;
    return expression.test(value);
  };
  
  this.countURL = function() {
    Urls.count({}, function( err, count){
      return count;
    });
  };
  
  this.getURL = function(req, res) {
    var url = '/';
    Urls.findOne({ 'hash': req.params.hash }, { '_id': false }, function(err, result) {
      if (err) { throw err; }
      if (result) url = result.original;
      res.redirect(url);
    });
  };
  
  this.addURL = function(req, res, prefix) {
    var uri = (prefix || '') + req.params.url;
    if (!this.isURL(uri)) {
      res.json({ "error": true });
      return;
    };
    var hash = ys.hash(uri);
    var url = {
      "original": uri,
      "hash": hash
    }
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
		Urls.findOneAndUpdate({ 'hash': hash }, url, options, function(err, result) {
			if (err) { throw err; }
      res.json({ "original_url": url.original, "short_url": (process.env.API_URL || '') + url.hash });
    });
  };
  
};

module.exports = URLShortener;
