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
  var query = Cart.where({
    'userName': req.params.userName
  });
  console.log("IN SHOW username: ", req.params.userName)
  query.findOne(function(err, cart) {
    if (err) {
      console.log("ERROR FROM SHOW: ", err)
      return handleError(res, err);
    }
    if (!cart) {
      console.log('searched but no cart in db')
      return res.send(404);
    }
    console.log("CARTATSHOW", cart)
    return res.json(cart);
  });
};

// Creates a new cart in the DB.
exports.create = function(req, res) {
  var cart = new Cart({
    'userName': req.params.userName,
    'items': req.body.items
  })
  Cart.create(req.body, function(err, cart) {
    if (err) {

      console.log('ERROR IN CREATE ON SERVER SIDE', err)
      return handleError(res, err);
    } else {
      console.log("IN server no error", cart)
      return res.json(201, cart);
    }
  });
};

// Updates an existing cart in the DB.
exports.update = function(req, res) {
  // if (req.body.id) {
  //   console.log('DELETING BODY ID IN UPDATE')
  //   delete req.body.id;
  // }
  console.log(req.body, "REQ BODY")
  console.log(req.params, "params")
  var cart = new Cart({
    'userName': req.params.userName,
    'items': req.body

  })
  console.log("CART", cart)
    // upsertCart = cart.toObject()
    // delete upsertCart._id
  console.log("IN EXPORTS UPDATE")

  var query = Cart.where({
    'userName': req.params.userName
  });
  Cart.findOneAndUpdate(query, {
    'items': req.body
  }, {
    upsert: true
  }, function(err, cart) {
    console.log(cart, "# of rows updated")
    if (err) {
      console.log("EROOR IN SERVERSIDE UPDATE")
      return handleError(res, err);
    }
    if (!cart) {
      return res.send(404);
    }
    // Cart.save(function(err) {
    //   if (err) {
    //     console.log("EROOR IN SERVERSIDE UPDATE #2")

    //     return handleError(res, err);
    //   }
    //   return res.json(200, cart);
    // });
  });
};

// Deletes a cart from the DB.
exports.destroy = function(req, res) {
  //searches by username which is appended to the file end in serverr
  Cart.findOneAndRemove({
    'userName': req.params.userName
  }, function(err, cart) {
    if (err) {
      return handleError(res, err);
    }
    if (!cart) {
      console.log('inside server side destroy')
      return res.send(404);
    }
    console.log("CART TO BE REMOVED ON SERVERSIDE:  ", cart)
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