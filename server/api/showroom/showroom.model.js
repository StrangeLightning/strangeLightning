'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShowroomSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Showroom', ShowroomSchema);