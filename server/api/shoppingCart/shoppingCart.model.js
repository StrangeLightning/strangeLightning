'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShoppingCartSchema = new Schema({
  user: String,
  items: String,
  active: Boolean
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);