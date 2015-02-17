'use strict';

var _ = require('lodash');
var Cart = require('./cart.model');

// Get list of carts
exports.index = function(req, res) {
  Cart.find(function (err, carts) {
    if(err) { return handleError(res, err); }
    return res.json(200, carts);
  });
};



// Get a single cart
exports.show = function(req, res) {
  Cart.findOne({'userName': req.params.userName}, function (err, cart) {
    if(err) { return handleError(res, err); }
    if(!cart) { return res.send(404); }
    return res.json(cart);
  });
};

// Creates a new cart in the DB.
exports.create = function(req, res) {
  Cart.create(req.body, function(err, cart) {
    if(err) { 

      console.log('ERROR IN CREATE ON SERVER SIDE', err)
      return handleError(res, err); }
    else{
      console.log("IN server no error", cart)
      return res.json(201, cart);
    }
  });
};

// Updates an existing cart in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  
  Cart.update({'userName' : req.params.userName}, {'items' : cartItems},{}, function (err, cart) {
    if (err) { return handleError(res, err); }
    if(!cart) { return res.send(404); }
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, cart);
    });
  });
};

// Deletes a cart from the DB.
exports.destroy = function(req, res) {
  //searches by username which is appended to the file end in serverr
  Cart.findOne({'userName' : req.params.userName}, function (err, cart) {
    if(err) { return handleError(res, err); }
    if(!cart) { 
      console.log('inside server side destroy')
      return res.send(404); }
    cart.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}