'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var OperationHelper = require('apac').OperationHelper;
var User = require('../user/user.model');

exports.createCart = function(req, res, next) {
  var opHelper = new OperationHelper({
    awsId: config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId: config.amazon.clientAccount
  });

  opHelper.execute('CartCreate', {
    'Item.1.ASIN': req.body.id,
    'Item.1.Quantity': '1'
  }, function(err, results) {
    var cart = results.CartCreateResponse.Cart[0];
    if (cart.Request && cart.Request[0].Errors) {
      console.log('Something went wrong! Here is a snippet: ' + JSON.stringify(cart.Request[0].Errors));
      res.end({
        error: 'Something went wrong! Here is a snippet: ' + JSON.stringify(cart.Request[0].Errors)
      });
    } else if (results.CartCreateResponse && results.CartCreateResponse.Cart) {
      if (req.user) {
        var user = req.user;
        user.cart = cart;
        user.cart.items = {};
        user.cart.items[req.body.id] = 1;
        user.cart.Quantity = 1;
        user.cart.ASIN2CART = {};
        user.cart.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[0].CartItemId[0];
        user.ASIN2CART = {};
        user.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[0].CartItemId[0];
        user.save(function(err, u) {
          if (!err) res.end(JSON.stringify(cart));
        });
      } else {
        res.end(JSON.stringify(cart));
      }
    } else {
      res.end('Something went wrong!')
    }
  });
};

exports.modifyCart = function(req, res, next) {
  var opHelper = new OperationHelper({
    awsId: config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId: config.amazon.clientAccount
  });

  if (req.user) {
    req.user.cart = req.user.cart || {}
  } // This is needed because of schema initialization
  // Check to see if the id is a stored ASIN
  if (req.user &&
    req.user.cart &&
    Object.keys(req.user.cart).length) {
    var user = req.user;
    var items = user.cart.items;
    var ASIN2CART = user.cart.ASIN2CART;
    if (user.ASIN2CART &&
      user.ASIN2CART[req.body.id]) {
      // IF it is get the CartItemId from the user document
      opHelper.execute('CartModify', {
        'CartId': user.cart.CartId[0],
        'HMAC': user.cart.HMAC[0],
        'Item.1.CartItemId': user.ASIN2CART[req.body.id],
        'Item.1.Quantity': req.body.Quantity === undefined ? 1 : req.body.Quantity,
      }, function(err, results) {
        var cart = results.CartModifyResponse.Cart[0];
        if (cart.CartItems === undefined) {
          exports.clearCart(req, res)
        }
        if (user && cart.CartItems) {
          user.cart = cart;
          user.cart.items = items;
          user.cart.items[req.body.id] = req.body.Quantity;
          user.cart.Quantity = calcQuantity(cart);
          user.cart.ASIN2CART = ASIN2CART;
          user.cart.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[0].CartItemId[0];
          user.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[0].CartItemId[0];
          user.save(function(err) {
            if (!err) res.end(JSON.stringify(cart));
          });
        } else {
          res.end(JSON.stringify(cart));
        }
      });
    } else {
      // IF NOT then greate it in the cart
      opHelper.execute('CartAdd', {
        'CartId': user.cart.CartId[0],
        'HMAC': user.cart.HMAC[0],
        'Item.1.ASIN': req.body.id,
        'Item.1.Quantity': '1'
      }, function(err, results) {

        var cart = results.CartAddResponse.Cart[0];
        if (user) {
          user.cart = cart;
          user.cart.items = items;
          user.cart.items[req.body.id] = 1;
          user.cart.ASIN2CART = ASIN2CART;
          user.ASIN2CART = ASIN2CART;
          user.cart.Quantity = calcQuantity(cart);
          var flag = true;
          for (var i = 0; i < cart.CartItems[0].CartItem.length; i++) {
            if (cart.CartItems[0].CartItem[i].ASIN[0] === req.body.id) {
              user.cart.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[i].CartItemId[0];
              user.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[i].CartItemId[0];
              flag = false;
              break;
            }
          }
          if (flag) throw new Error('Cannot add id to ASIN2CART 129');
          user.save(function(err, _user) {
            if (err) {
              console.log(err)
            }
            if (!err) {
              res.end(JSON.stringify(cart))
            }
          });
        } else {
          res.end(JSON.stringify(cart));
        }
      });
    }
  } else {
    res.end('Something went wrong!')
  }
};

exports.clearCart = function(req, res, next) {
  var opHelper = new OperationHelper({
    awsId: config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId: config.amazon.clientAccount
  });

  if (req.user.cart && Object.keys(req.user.cart).length) {
    opHelper.execute('CartClear', {
      'CartId': req.user.cart.CartId[0],
      'HMAC': req.user.cart.HMAC[0]
    }, function(err, results) {
      var cart = results.CartClearResponse.Cart[0];
      if (req.user) {
        var user = req.user;
        user.cart = {};
        user.ASIN2CART = {};
        user.save(function(err) {
          if (!err) res.end(JSON.stringify(cart));
        });
      } else {
        res.end(JSON.stringify(cart));
      }
    });
  }
};

exports.getCart = function(req, res, next) {
  var opHelper = new OperationHelper({
    awsId: config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId: config.amazon.clientAccount
  });

  opHelper.execute('CartGet', {
    'CartId': req.user.cart && Object.keys(req.user.cart || {}).length ? req.user.cart.CartId[0] : req.body.CartId,
    'HMAC': req.user.cart && Object.keys(req.user.cart || {}).length ? req.user.cart.HMAC[0] : req.body.HMAC
  }, function(err, results) {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      var cart;
      if (results.CartGetResponse && results.CartGetResponse.Cart) {
        cart = results.CartGetResponse.Cart[0];
        if (req.user.cart && Object.keys(req.user.cart || {}).length) {
          cart.items = req.user.cart.items;
          cart.Quantity = calcQuantity(cart);
        }
      }
      res.end(JSON.stringify(cart));
    }
  });
};

function calcQuantity(cart) {
  var count = 0;
  for (var i in cart.items) {
    count += +cart.items[i];
  }
  return count;
}
