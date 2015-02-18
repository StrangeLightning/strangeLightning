'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var OperationHelper = require('apac').OperationHelper;

var validationError = function(res, err) {
  return res.json(422, err);
};
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
exports.createCart = function (req, res, next) {
  var opHelper = new OperationHelper({
    awsId:     config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId:   config.amazon.clientAccount 
  });
  var t = new Date().getTime();
  opHelper.execute('CartCreate', {
      'Item.1.ASIN': req.body.id,
      'Item.1.Quantity': '1',
    }, function(err, results) {
      var _results = [];
      res.end(JSON.stringify(results.CartCreateResponse.Cart[0]));
  });
};

exports.modifyCart = function (req, res, next) {
  var opHelper = new OperationHelper({
    awsId:     config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId:   config.amazon.clientAccount 
  });
  var t = new Date().getTime();
  opHelper.execute('CartModify', {
      'CartId': req.body.CartId,
      'HMAC': req.body.HMAC,
      'Item.1.CartItemId': req.body.ProductId,
      'Item.1.Quantity': req.body.Quantity,
    }, function(err, results) {
      var _results = [];
      res.end(JSON.stringify(results));
  });
};

exports.clearCart = function (req, res, next) {
  var opHelper = new OperationHelper({
    awsId:     config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId:   config.amazon.clientAccount 
  });
  var t = new Date().getTime();
  opHelper.execute('CartClear', {
      'CartId': req.body.CartId,
      'HMAC': req.body.HMAC,
    }, function(err, results) {
      var _results = [];
      res.end(JSON.stringify(results));
  });
};

exports.getCart = function (req, res, next) {
  var opHelper = new OperationHelper({
    awsId:     config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId:   config.amazon.clientAccount 
  });
  console.log(req.body)
  var t = new Date().getTime();
  opHelper.execute('CartGet', {
      'CartId': req.body.CartId,
      'HMAC': req.body.HMAC,
    }, function(err, results) {
      var _results = [];
      res.end(JSON.stringify(results));
  });
};

// {"CartId": "185-8896300-7972668” , "HMAC" : "lfkVg6eVSf4zYk8Q8dgN3g4WmAU%3D” }
// /**
//  * Get list of buyers
//  * restriction: 'admin'
//  */
// exports.index = function(req, res) {
//   Buyer.find({}, '-salt -hashedPassword', function (err, buyers) {
//     if(err) return res.send(500, err);
//     res.json(200, buyers);
//   });
// };

// /**
//  * Creates a new buyer
//  */
// exports.create = function (req, res, next) {
//   var newBuyer = new Buyer(req.body);
//   newBuyer.provider = 'local';
//   newBuyer.role = 'buyer';
//   newBuyer.save(function(err, buyer) {
//     if (err) return validationError(res, err);
//     var token = jwt.sign({_id: buyer._id }, config.secrets.session, { expiresInMinutes: 60*5 });
//     res.json({ token: token });
//   });
// };

// /**
//  * Get a single buyer
//  */
// exports.show = function (req, res, next) {
//   var buyerId = req.params.id;

//   Buyer.findById(buyerId, function (err, buyer) {
//     if (err) return next(err);
//     if (!buyer) return res.send(401);
//     res.json(buyer.profile);
//   });
// };

// /**
//  * Deletes a buyer
//  * restriction: 'admin'
//  */
// exports.destroy = function(req, res) {
//   Buyer.findByIdAndRemove(req.params.id, function(err, buyer) {
//     if(err) return res.send(500, err);
//     return res.send(204);
//   });
// };

// /**
//  * Change a buyers password
//  */
// exports.changePassword = function(req, res, next) {
//   var buyerId = req.buyer._id;
//   var oldPass = String(req.body.oldPassword);
//   var newPass = String(req.body.newPassword);

//   Buyer.findById(buyerId, function (err, buyer) {
//     if(buyer.authenticate(oldPass)) {
//       buyer.password = newPass;
//       buyer.save(function(err) {
//         if (err) return validationError(res, err);
//         res.send(200);
//       });
//     } else {
//       res.send(403);
//     }
//   });
// };

// /**
//  * Get my info
//  */
// exports.me = function(req, res, next) {
//   var buyerId = req.buyer._id;
//   Buyer.findOne({
//     _id: buyerId
//   }, '-salt -hashedPassword', function(err, buyer) { // don't ever give out the password or salt
//     if (err) return next(err);
//     if (!buyer) return res.json(401);
//     res.json(buyer);
//   });
// };

// /**
//  * Buy a product
//  */
// exports.buy = function(req, res, next) {
//   var buyerId = req.params.id;
//   User.findOne({
//     _id: buyerId
//   }, '-salt -hashedPassword', function(err, buyer) { // don't ever give out the password or salt
//     if (err) return next(err);
//     if (!buyer) return res.json(401);
//     res.json(buyer);
//   });
// };

// /**
//  * Authentication callback
//  */
// exports.authCallback = function(req, res, next) {
//   res.redirect('/');
// };
