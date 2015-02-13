'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
  name: String,
  items: String,
  active: Boolean
});

module.exports = mongoose.model('Cart', CartSchema);