// This file sets up the process.ENV so that we can load images into AWS S3

var AWS = require('aws-sdk'),
  crypto = require('crypto'),
  createS3Policy,
  getExpiryTime,
  config = {};

//handle error if aws.json does not exist
try {
  config = require('./aws.json')
}
catch(e) {
  console.log('aws.json not found');
}

getExpiryTime = function() {
  var _date = new Date();
  return '' + (_date.getFullYear()) + '-' + (_date.getMonth() + 1) + '-' +
    (_date.getDate() + 1) + 'T' + (_date.getHours() + 3) + ':' + '00:00.000Z';
};

createS3Policy = function(contentType, callback) {
  var date = new Date();
  var s3Policy = {
    'expiration': getExpiryTime(),
    'conditions': [
      ['starts-with', '$key', 'sa/'],
      {'bucket': config.bucket || process.env.BUCKET },
      {'acl': 'public-read'},
      ['starts-with', '$Content-Type', contentType],
      {'success_action_status': '201'}
    ]
  };

  // stringify and encode the policy
  var stringPolicy = JSON.stringify(s3Policy);
  var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // sign the base64 encoded policy
  var signature = crypto.createHmac('sha1', config.secretAccessKey || process.env.SECRET_ACCESS_KEY )
    .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  // build the results object
  var s3Credentials = {
    s3Policy: base64Policy,
    s3Signature: signature,
    AWSAccessKeyId:  config.accessKeyId || process.env.ACCESS_KEY_ID
  };

  // send it back
  callback(s3Credentials);
};

exports.getS3Policy = function(req, res) {
  createS3Policy(req.query.mimeType, function(creds, err) {
    if(!err) {
      return res.send(200, creds);
    } else {
      return res.send(500, err);
    }
  });
};
