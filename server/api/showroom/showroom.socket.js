/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Showroom = require('./showroom.model');

exports.register = function(socket) {
  Showroom.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Showroom.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('showroom:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('showroom:remove', doc);
}