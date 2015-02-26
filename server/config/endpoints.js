var AWS = require('aws-sdk');
var config;

try {
  config = require("./environment");
} catch(e) {
  console.log(e);
}

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID || config.cloudsearch.accessKeyId,
  secretAccessKey:  process.env.SECRET_ACCESS_KEY || config.cloudsearch.secretAccessKey,
  region: 'us-west-2'
});

//AWS cloudsearchdomain configuration
exports.cloudsearchdomain = new AWS.CloudSearchDomain({
  endpoint: 'https://search-sphereable-staging-7wyt6pm6h5uicoxjypgnam4mxi.us-west-2.cloudsearch.amazonaws.com',
  apiVersion: '2013-01-01'
});

//AWS cloudsearch configuration
exports.cloudsearch = new AWS.CloudSearch({
  apiVersion: '2013-01-01'
});

exports.domain = "sphereable";
