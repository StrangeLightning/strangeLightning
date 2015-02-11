'use strict';

var _ = require('lodash');
var Vendor = require('./vendor.model');

// Get list of vendors
exports.index = function(req, res) {
  Vendor.find(function (err, vendors) {
    if(err) { return handleError(res, err); }
    return res.json(200, vendors);
  });
};

// Get a single vendor
exports.show = function(req, res) {
  Vendor.findById(req.params.id, function (err, vendor) {
    if(err) { return handleError(res, err); }
    if(!vendor) { return res.send(404); }
    return res.json(vendor);
  });
};

// Creates a new vendor in the DB.
exports.create = function(req, res) {
  Vendor.create(req.body, function(err, vendor) {
    if(err) { return handleError(res, err); }
    return res.json(201, vendor);
  });
};

// Updates an existing vendor in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Vendor.findById(req.params.id, function (err, vendor) {
    if (err) { return handleError(res, err); }
    if(!vendor) { return res.send(404); }
    var updated = _.merge(vendor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, vendor);
    });
  });
};

// Deletes a vendor from the DB.
exports.destroy = function(req, res) {
  Vendor.findById(req.params.id, function (err, vendor) {
    if(err) { return handleError(res, err); }
    if(!vendor) { return res.send(404); }
    vendor.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}