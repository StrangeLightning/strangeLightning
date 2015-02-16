'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
  itemId : String,
  name : String,
  price : String
});

module.exports = mongoose.model('Cart', CartSchema);