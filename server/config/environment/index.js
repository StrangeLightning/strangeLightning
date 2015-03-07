'use strict';

var path = require('path');
var _ = require('lodash');
var local = {};
try {
  local = require('./../local.env.js');
} catch (err) {
  //do nothing
}

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 4430,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'thesis-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options : {
      db: { safe: true }
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || local.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET || local.FACEBOOK_SECRET,
    callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID: process.env.TWITTER_ID || local.TWITTER_ID,
    clientSecret: process.env.TWITTER_SECRET || local.TWITTER_SECRET,
    callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID: process.env.GOOGLE_ID || local.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET || local.GOOGLE_SECRET,
    callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
  },

  amazon: {
    clientID: process.env.AMAZON_ID || local.AMAZON_ID,
    clientSecret: process.env.AMAZON_SECRET || local.AMAZON_SECRET,
    clientAccount: process.env.AMAZON_ACCOUNT || local.AMAZON_ACCOUNT,
    callbackURL: (process.env.DOMAIN || '') + '/auth/amazon/callback'
  },

  amazonOAuth: {
    clientID: process.env.AMAZON_OAuth_ID || local.AMAZON_OAuth_ID,
    clientSecret: process.env.AMAZON_OAuth_SECRET || local.AMAZON_OAuth_SECRET,
    callbackURL: (process.env.DOMAIN || '') + '/auth/amazon/callback'

  },

  cloudsearch: {
    accessKeyId: process.env.CLOUDSEARCH_AMAZON_ID || local.CLOUDSEARCH_AMAZON_ID,
    secretAccessKey: process.env.CLOUDSEARCH_AMAZON_SECRET || local.CLOUDSEARCH_AMAZON_SECRET
  }


};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
