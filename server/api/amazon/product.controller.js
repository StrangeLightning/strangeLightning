'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var OperationHelper = require('apac').OperationHelper;

var validationError = function(res, err) {
  return res.json(422, err);
};

exports.searchCart = function (req, res, next) {
  var opHelper = new OperationHelper({
    awsId:     config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId:   config.amazon.clientAccount
  });
  var t = new Date().getTime();
  //console.log(t);
  opHelper.execute('ItemSearch', {
      'Keywords': req.body.term,
      'SearchIndex': 'Blended',
      'ItemPage': '1',
      'ResponseGroup': 'Similarities,ItemIds,ItemAttributes,Images'
    }, function(err, results) {
      var _results = [];
      var r = results.ItemSearchResponse.Items[0];
      //console.log(r);
      var r2 = results.ItemSearchResponse.Items[0].Item;
      var i = 0;
      while (_results.length < 12) {
        var obj = r2[i];
        var product = {};
        // Sometimes no ItemAttributes Returned
        if ('ItemAttributes' in r2[i] && obj.ItemAttributes[0].ListPrice) {
          product.id = obj.ASIN[0];
          product.price = obj.ItemAttributes[0].ListPrice[0].FormattedPrice[0];
          product.title = obj.ItemAttributes[0].Title[0];
          product.smallImage = obj.SmallImage[0].URL[0];
          product.mediumImage = obj.MediumImage[0].URL[0];
          product.largeImage = obj.LargeImage[0].URL[0];
          _results.push(product);
        }

        i++;
      }
      res.end(JSON.stringify({time: new Date().getTime() - t, data: _results}));
  });
};

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
