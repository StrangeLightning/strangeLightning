'use strict';

var express = require('express');
var controller = require('./cart.controller');

var router = express.Router();

//get all the carts
router.get('/', controller.index);
//gets the user's cart
router.get('/name/:userName', controller.show);
// router.post('/', controller.create);
//adds item to user's schema db

router.put('/name/:userName', controller.create);
router.post('/name/:userName', controller.update);
//deletes item from the user's schema
router.delete('/name/:userName', controller.destroy);

module.exports = router;