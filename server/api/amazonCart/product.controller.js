'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var OperationHelper = require('apac').OperationHelper;
var User = require('../user/user.model');
var userController = require('../user/user.controller');


var validationError = function(res, err) {
  return res.json(422, err);
};

exports.createCart = function(req, res, next) {
  var opHelper = new OperationHelper({
    awsId: config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId: config.amazon.clientAccount
  });
  console.log('CREATE -- CART')
  var t = new Date().getTime();
  opHelper.execute('CartCreate', {
    'Item.1.ASIN': req.body.id,
    'Item.1.Quantity': '1'
  }, function(err, results) {
    var _results = [];
    var cart = results.CartCreateResponse.Cart[0];
    if (cart.Request && cart.Request[0].Errors) {
      console.log('Something went wrong! Here is a snippet: ' + JSON.stringify(cart.Request[0].Errors));
      res.end({
        error: 'Something went wrong! Here is a snippet: ' + JSON.stringify(cart.Request[0].Errors)
      });
    } 
    else if (results.CartCreateResponse && results.CartCreateResponse.Cart) {
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
  var t = new Date().getTime();

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
        'Item.1.Quantity': req.body.Quantity || 1,
      }, function(err, results) {
        var cart = results.CartModifyResponse.Cart[0];

        if (user && cart.CartItems) {
          user.cart = cart;
          user.cart.items = items;
          user.cart.items[req.body.id] = req.body.Quantity;
          user.cart.Quantity = calcQuantity(cart);
          user.cart.ASIN2CART = ASIN2CART;
          user.cart.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[0].CartItemId[0];
          user.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[0].CartItemId[0];
          console.log(user.cart.items);
          user.save(function(err) {
            if (!err) res.end(JSON.stringify(cart));
          });
        } 
        else {
          res.end(JSON.stringify(cart));
        }
      });
    } 
    else {
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
              console.log("ASIN", user.ASIN2CART, req.body.id);
              user.cart.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[i].CartItemId[0];
              user.ASIN2CART[req.body.id] = cart.CartItems[0].CartItem[i].CartItemId[0];
              console.log("ASIN", user.ASIN2CART, req.body.id);
              flag = false;
              break;
            }
          }
          if (flag) throw new Error('Cannot add id to ASIN2CART 129');
          user.save(function(err, _user) {
            if (err) {console.log(err)}
            if (!err) {
              console.log(_user, "user object after saving")
              res.end(JSON.stringify(cart))
            };
          });
        } 
        else {
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
  var t = new Date().getTime();
  if (req.user.cart && Object.keys(req.user.cart).length) {
    opHelper.execute('CartClear', {
      'CartId': req.user.cart.CartId[0],
      'HMAC': req.user.cart.HMAC[0]
    }, function(err, results) {
      var _results = [];
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

  var t = new Date().getTime();

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
  // console.log(cart.items);
  return count;
}

// {
// "time": 4626,
// "data": [
// {
// "id": "B00F3J0GIE",
// "price": "$734.99",
// "title": "Apple iPhone 5s 16GB (Silver) - Sprint",
// "smallImage": "http://ecx.images-amazon.com/images/I/51k0rD7-BzL._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/51k0rD7-BzL._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/51k0rD7-BzL.jpg"
// },
// {
// "id": "B0096VDM8G",
// "price": "$1,299.00",
// "title": "Apple MacBook Pro MGX72LL/A 13.3-Inch Laptop with Retina Display (NEWEST VERSION)",
// "smallImage": "http://ecx.images-amazon.com/images/I/410WBREF71L._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/410WBREF71L._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/410WBREF71L.jpg"
// },
// {
// "id": "B00746Z6RK",
// "price": "$999.00",
// "title": "Apple MacBook Air MD760LL/B 13.3-Inch Laptop (NEWEST VERSION)",
// "smallImage": "http://ecx.images-amazon.com/images/I/51gy9VdYCeL._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/51gy9VdYCeL._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/51gy9VdYCeL.jpg"
// },
// {
// "id": "B0019N889M",
// "price": "$850.00",
// "title": "Apple MB323LL/A iMac 20-inch 2.4GHz 2GB Intel Core 2 Duo, 1 GB ram, 250 GB SATA hard drive, Aluminum Case (A1224)",
// "smallImage": "http://ecx.images-amazon.com/images/I/31mf0r-D45L._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/31mf0r-D45L._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/31mf0r-D45L.jpg"
// },
// {
// "id": "B00GARI8BK",
// "price": "$99,999.99",
// "title": "OtterBox Defender Realtree Series Hybrid Case and Holster for iPhone 5/5S - Retail Packaging",
// "smallImage": "http://ecx.images-amazon.com/images/I/313jZphwV-L._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/313jZphwV-L._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/313jZphwV-L.jpg"
// },
// {
// "id": "B00Q3NA058",
// "price": "$21.99",
// "title": "Apple Iphone 5 / 5s / 5c, 6, 6plus Charger with a Car Charger (High Quality)",
// "smallImage": "http://ecx.images-amazon.com/images/I/51YMCotHGJL._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/51YMCotHGJL._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/51YMCotHGJL.jpg"
// },
// {
// "id": "B00FA4Y7N2",
// "price": "$14.99",
// "title": "AmazonBasics Apple Certified Lightning to USB Cable - 6 Feet (1.8 Meters) - White",
// "smallImage": "http://ecx.images-amazon.com/images/I/31yMYG8kioL._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/31yMYG8kioL._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/31yMYG8kioL.jpg"
// },
// {
// "id": "B00QSB3UXE",
// "price": "$29.99",
// "title": "New Genuine Authentic OEM Apple iPhone 5 5S 5C 6 6+ Plus iPad Air iPad Mini Rapid 1 Amp Travel Home Wall Adapter Charger (Model Number A1365) + Mini Stylus",
// "smallImage": "http://ecx.images-amazon.com/images/I/31wi6m2XDHL._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/31wi6m2XDHL._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/31wi6m2XDHL.jpg"
// },
// {
// "id": "B00NGHM76O",
// "price": "$24.99",
// "title": "JOTO iPhone 6 Plus 5.5 Tempered Glass Screen Protector - iPhone 6 Plus 0.33 mm Rounded Edge Tempered Glass Screen Protector Film Guard for Apple iPhone 6 Plus 5.5 inch (1 Pack)",
// "smallImage": "http://ecx.images-amazon.com/images/I/51Xgolx%2BQ8L._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/51Xgolx%2BQ8L._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/51Xgolx%2BQ8L.jpg"
// },
// {
// "id": "B00O2L4KWC",
// "price": "$74.00",
// "title": "Ecandy Bluetooth Speaker,6 Hours of Playing Time - Built-in Mic for Hands Free Speakerphone Rechargeable Wireless Speaker,AUX Line in & TF Card Slot,Compatible with Iphone, Ipod , Ipad Mini, Ipad Air 4/3/2, Itouch, Blackberry, Nexus, Samsung, Other Smart Phones, Mp3 Players, and Computers Laptop or Desktop and other Enabled Bluetooth Speakers (Pink)",
// "smallImage": "http://ecx.images-amazon.com/images/I/41Gt0Wl-%2BZL._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/41Gt0Wl-%2BZL._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/41Gt0Wl-%2BZL.jpg"
// },
// {
// "id": "B00ICCQVIS",
// "price": "$36.99",
// "title": "Rubies Ever After High Child Apple White Costume",
// "smallImage": "http://ecx.images-amazon.com/images/I/41QRKwZ0ffL._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/41QRKwZ0ffL._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/41QRKwZ0ffL.jpg"
// },
// {
// "id": "0823416690",
// "price": "$7.99",
// "title": "Apples",
// "smallImage": "http://ecx.images-amazon.com/images/I/51NZNGJ5R7L._SL75_.jpg",
// "mediumImage": "http://ecx.images-amazon.com/images/I/51NZNGJ5R7L._SL160_.jpg",
// "largeImage": "http://ecx.images-amazon.com/images/I/51NZNGJ5R7L.jpg"
// }
// ]
// }