'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var config = require('../../config/environment/index.js');
// console.log("CCONONNNFFIIIGG IS AVAILABLE", config)
var router = express.Router();
var app = express()
router
  .get('/', function() {
    console.log('hit the server')
  })

router.get('/publicClientAuth', function(req, res) {

  res.send(config.amazonOAuth.clientID)
    // amazon.Login.setClientId(config.amazonOAuth.ClientID);
})


// router.get('/',
//   passport.authenticate('amazon'));

// router.get('/callback',
//   passport.authenticate('amazon', {
//     failureRedirect: '/login'
//   }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });
// // router
//   .get('/', passport.authenticate('amazon', {
//     // scope: ['email', 'user_about_me'],
//     failureRedirect: '/signup',
//     session: false
//   }))

// .get('/callback', passport.authenticate('amazon', {
//   failureRedirect: '/signup',
//   session: false
// }), auth.setTokenCookie);

module.exports = router;