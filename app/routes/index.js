'use strict';

var URLShortener = require(process.cwd() + '/app/controllers/urlShortener.server.js');

module.exports = function (app) {
  
  var urlShortener = new URLShortener();
  
  app.route('/')
      .get(function (req, res) {
          res.sendFile(process.cwd() + '/public/index.html');
      });

  app.route('/:hash')
      .get(function (req, res) {
          urlShortener.getURL(req, res);
      });

  app.route('/new/:url')
      .get(function (req, res) {
        urlShortener.addURL(req, res);
      });

  app.route('/new/http://:url')
      .get(function (req, res) {
        urlShortener.addURL(req, res, 'http://');
        console.log('new: http:');
      });
      
  app.route('/new/https://:url')
      .get(function (req, res) {
        urlShortener.addURL(req, res, 'https://');
        console.log('new: https:');
      });

};
