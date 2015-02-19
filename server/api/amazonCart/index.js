'use strict';

var express = require('express');
var controller = require('./product.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var util = require('util');

var router = express.Router();

router.post('/create', auth.isAuthenticated(), controller.createCart);
router.post('/get', auth.isAuthenticated(), controller.getCart);
router.post('/modify', auth.isAuthenticated(), controller.modifyCart);
router.post('/clear', auth.isAuthenticated(), controller.clearCart);

module.exports = router;