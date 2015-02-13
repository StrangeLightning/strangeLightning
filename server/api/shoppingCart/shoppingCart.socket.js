/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ShoppingCart = require('./shoppingCart.model');

exports.register = function(socket) {
  ShoppingCart.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ShoppingCart.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('shoppingCart:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('shoppingCart:remove', doc);
}