'use strict';

var _ = require('lodash');
var ShoppingCart = require('./shoppingCart.model');

// Get list of shoppingCarts
exports.index = function(req, res) {
  ShoppingCart.find(function (err, shoppingCarts) {
    if(err) { return handleError(res, err); }
    return res.json(200, shoppingCarts);
  });
};

// Get a single shoppingCart
exports.show = function(req, res) {
  ShoppingCart.findById(req.params.id, function (err, shoppingCart) {
    if(err) { return handleError(res, err); }
    if(!shoppingCart) { return res.send(404); }
    return res.json(shoppingCart);
  });
};

// Creates a new shoppingCart in the DB.
exports.create = function(req, res) {
  ShoppingCart.create(req.body, function(err, shoppingCart) {
    if(err) { return handleError(res, err); }
    return res.json(201, shoppingCart);
  });
};

// Updates an existing shoppingCart in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ShoppingCart.findById(req.params.id, function (err, shoppingCart) {
    if (err) { return handleError(res, err); }
    if(!shoppingCart) { return res.send(404); }
    var updated = _.merge(shoppingCart, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, shoppingCart);
    });
  });
};

// Deletes a shoppingCart from the DB.
exports.destroy = function(req, res) {
  ShoppingCart.findById(req.params.id, function (err, shoppingCart) {
    if(err) { return handleError(res, err); }
    if(!shoppingCart) { return res.send(404); }
    shoppingCart.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}