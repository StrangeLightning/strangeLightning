'use strict';

var express = require('express');
var controller = require('./product.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var util = require('util');

var router = express.Router();

router.post('/create', controller.createCart);
router.post('/get', controller.getCart);
router.post('/modify', controller.modifyCart);
router.post('/:cartId/clear', controller.clearCart);

module.exports = router;