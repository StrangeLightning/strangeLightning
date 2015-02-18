'use strict';

var express = require('express');
var controller = require('./cart.controller');

var router = express.Router();

//get all the carts
router.get('/', controller.index);
//gets the user's cart
router.get('/name/:userName', controller.show);


//adds item to user's schema db
router.put('/name/:userName', controller.create);

//updates items in cart for user's schema, used for removeItem and addItem on the front-end
router.post('/name/:userName', controller.update);

//clears User's items, drops Schema
router.delete('/name/:userName', controller.destroy);

module.exports = router;