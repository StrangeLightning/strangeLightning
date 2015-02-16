'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
  items: String,
});

module.exports = mongoose.model('Cart', CartSchema);