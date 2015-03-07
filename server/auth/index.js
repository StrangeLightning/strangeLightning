'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');
var router = express.Router();

// Passport Configuration
// require('./local/passport').setup(User, config);
require('./facebook/passport').setup(User, config);
// require('./amazon/authenticateClient').setup(User, config);
// require('./google/passport').setup(User, config);
// require('./twitter/passport').setup(User, config);


// router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/amazon', require('./amazon'))
  // router.use('/twitter', require('./twitter'));
  // router.use('/google', require('./google'));

module.exports = router;