'use strict';

var Buyer = require('./buyer.model.js');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of buyers
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  Buyer.find({}, '-salt -hashedPassword', function (err, buyers) {
    if(err) return res.send(500, err);
    res.json(200, buyers);
  });
};

/**
 * Creates a new buyer
 */
exports.create = function (req, res, next) {
  var newBuyer = new Buyer(req.body);
  newBuyer.provider = 'local';
  newBuyer.role = 'buyer';
  newBuyer.save(function(err, buyer) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: buyer._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single buyer
 */
exports.show = function (req, res, next) {
  var buyerId = req.params.id;

  Buyer.findById(buyerId, function (err, buyer) {
    if (err) return next(err);
    if (!buyer) return res.send(401);
    res.json(buyer.profile);
  });
};

/**
 * Deletes a buyer
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  Buyer.findByIdAndRemove(req.params.id, function(err, buyer) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a buyers password
 */
exports.changePassword = function(req, res, next) {
  var buyerId = req.buyer._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Buyer.findById(buyerId, function (err, buyer) {
    if(buyer.authenticate(oldPass)) {
      buyer.password = newPass;
      buyer.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var buyerId = req.buyer._id;
  Buyer.findOne({
    _id: buyerId
  }, '-salt -hashedPassword', function(err, buyer) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!buyer) return res.json(401);
    res.json(buyer);
  });
};

/**
 * Buy a product
 */
exports.buy = function(req, res, next) {
  var buyerId = req.params.id;
  User.findOneById({
    _id: buyerId
  }, '-salt -hashedPassword', function(err, buyer) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!buyer) return res.json(401);
    res.json(buyer);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
