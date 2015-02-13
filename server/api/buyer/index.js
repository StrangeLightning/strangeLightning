'use strict';

var express = require('express');
var controller = require('./buyer.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/buy/:username/:data', auth.isAuthenticated(), controller.buy);
router.get('/:username', auth.isAuthenticated(), controller.show);
router.post('/:id/:data', auth.isAuthenticated(), controller.create
module.exports = router;
