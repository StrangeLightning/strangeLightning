'use strict';

var _ = require('lodash');
var Showroom = require('./showroom.model');

// Get list of showrooms
exports.index = function(req, res) {
  Showroom.find(function (err, showrooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, showrooms);
  });
};

// Get a single showroom
exports.show = function(req, res) {
  Showroom.findById(req.params.id, function (err, showroom) {
    if(err) { return handleError(res, err); }
    if(!showroom) { return res.send(404); }
    return res.json(showroom);
  });
};

// Creates a new showroom in the DB.
exports.create = function(req, res) {
  Showroom.create(req.body, function(err, showroom) {
    if(err) { return handleError(res, err); }
    return res.json(201, showroom);
  });
};

// Updates an existing showroom in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Showroom.findById(req.params.id, function (err, showroom) {
    if (err) { return handleError(res, err); }
    if(!showroom) { return res.send(404); }
    var updated = _.merge(showroom, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, showroom);
    });
  });
};

// Deletes a showroom from the DB.
exports.destroy = function(req, res) {
  Showroom.findById(req.params.id, function (err, showroom) {
    if(err) { return handleError(res, err); }
    if(!showroom) { return res.send(404); }
    showroom.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}