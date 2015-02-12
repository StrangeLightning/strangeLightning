'use strict';

var Vendor = require('./vendor.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of vendors
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  Vendor.find(function (err, vendors) {
    if(err) { return handleError(res, err); }
    return res.json(200, vendors);
  });
};

/**
 * Creates a new vendor
 */
exports.create = function (req, res, next) {
  var newVendor = new Vendor(req.body);
  newVendor.provider = 'local';
  newVendor.role = 'vendor';
  newVendor.save(function(err, vendor) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: vendor._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single vendor
 */
exports.show = function (req, res, next) {
  var vendorId = req.params.id;

  Vendor.findById(vendorId, function (err, vendor) {
    if (err) return next(err);
    if (!vendor) return res.send(401);
    res.json(vendor.profile);
  });
};

/**
 * Deletes a vendor
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  Vendor.findByIdAndRemove(req.params.id, function(err, vendor) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a vendors password
 */
exports.changePassword = function(req, res, next) {
  var vendorId = req.vendor._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Vendor.findById(vendorId, function (err, vendor) {
    if(vendor.authenticate(oldPass)) {
      vendor.password = newPass;
      vendor.save(function(err) {
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
  var vendorId = req.vendor._id;
  Vendor.findOne({
    _id: vendorId
  }, '-salt -hashedPassword', function(err, vendor) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!vendor) return res.json(401);
    res.json(vendor);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
