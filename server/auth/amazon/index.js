'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();


router.get('/',
  passport.authenticate('amazon'));

router.get('/callback',
  passport.authenticate('amazon', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/callback');
  });
// router
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