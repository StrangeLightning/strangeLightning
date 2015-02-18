/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./server/config/environment');
var https = require('https');
var fs = require('fs');
var path = require('path');

var credentials = {
  key: process.env.NODE_ENV === 'production' ? fs.readFileSync(path.join(__dirname, '/../../shared/config/ssl.key'), 'utf-8')  : fs.readFileSync('./shared/config/ssl.key', 'utf-8'),
  cert: process.env.NODE_ENV === 'production' ? fs.readFileSync(path.join(__dirname, '/../../shared/config/ssl.crt'), 'utf-8') : fs.readFileSync('./shared/config/ssl.crt', 'utf-8')
};

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./server/config/seed'); }

// Setup server
var app = express();
var serverHTTPS = require('https').createServer(credentials, app);
var serverHTTP = require('http').createServer(app);

if (process.env.NODE_ENV === 'production') {
  serverHTTPS.listen(443, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
  serverHTTP.listen(80, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

else if (process.env.NODE_ENV === 'development') { 
  serverHTTP.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
  serverHTTPS.listen(4430, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

// Redirect all requests to https
app.all('*', function(req, res, next) {
  if (req.protocol !== 'https') {
    res.redirect('https://' + req.get('host') + req.originalUrl);
  }
  else {next();}
});

// For POSTMAN TESTING
// app.all('*', function(req, res, next) {
//   console.log(req.url);
//   next();
// });

// serverHTTP.listen(config.port, config.ip, function () {
//     console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
// });

var socketio = require('socket.io')(serverHTTP, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});

require('./server/config/socketio')(socketio);
require('./server/config/express')(app);
require('./server/routes')(app);

// Expose app
exports = module.exports = app;
