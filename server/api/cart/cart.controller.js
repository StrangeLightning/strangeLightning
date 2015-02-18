'use strict';

var _ = require('lodash');
var Cart = require('./cart.model');

// Get list of carts
exports.index = function(req, res) {
  Cart.find(function(err, carts) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, carts);
  });
};

// Get a single cart
exports.show = function(req, res) {
  //query parameter
  var query = Cart.where({
    'userName': req.params.userName
  });

  //find matching query
  query.findOne(function(err, cart) {
    if (err) {
      console.log("ERROR FROM cart.controller: ", err);
      return handleError(res, err);
    }
    if (!cart) {
      console.log('searched but no cart in db');
      return res.send(404);
    }
    console.log("cart on server: ", cart);
    //return queried cart
    return res.json(cart);
  });
};

// Creates a new cart in the DB
exports.create = function(req, res) {
  var cart = new Cart({
    'userName': req.params.userName,
    'items': req.body.items
  })
  Cart.create(req.body, function(err, cart) {
    if (err) {

      console.log('ERROR IN CREATE CART CONTROLLER:  ', err)
      return handleError(res, err);
    } else {
      console.log("creating cart: ", cart)
      return res.json(201, cart);
    }
  });
};

// Updates an existing cart in the DB, specifically items
exports.update = function(req, res) {
  //queries the username
  var query = Cart.where({
    'userName': req.params.userName
  });
  //find a matching query(arg1), updates items (arg 2), upsert: if new row make new row (option in arg 3)
  Cart.findOneAndUpdate(query, {
    'items': req.body
  }, {
    upsert: true
  }, function(err, cart) {
    console.log(cart, "row updated");
    if (err) {
      console.log("ERROR in cart.controller(serverside): ", err)
      return handleError(res, err);
    }
    if (!cart) {
      return res.send(404);
    }
  });
};

// Deletes a cart from the DB, removes user from cart schema as well.
exports.destroy = function(req, res) {
  //searches by username
  Cart.findOneAndRemove({
    'userName': req.params.userName
  }, function(err, cart) {
    if (err) {
      return handleError(res, err);
    }
    if (!cart) {
      console.log('inside server side destroy');
      return res.send(404);
    }
    console.log("CART TO BE REMOVED ON SERVERSIDE:  ", cart);
    cart.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}