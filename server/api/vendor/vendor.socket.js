/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Vendor = require('./vendor.model');

exports.register = function(socket) {
  Vendor.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Vendor.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('vendor:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('vendor:remove', doc);
}