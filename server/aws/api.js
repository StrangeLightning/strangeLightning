//handle error if aws.json does not exist
var config = {};
try {
  config = require('./aws.json')
}
catch(e) {
  console.log('aws.json not found');
}

exports.getClientConfig = function(req, res, next) {
  return res.json(200, {
    awsConfig: {
      bucket:  config.bucket || process.env.BUCKET
    }
  });
};
