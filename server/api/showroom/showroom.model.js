'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ShowroomSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Showroom', ShowroomSchema);