'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: "thesis-secret",

  FACEBOOK_ID: '321046161424690',
  FACEBOOK_SECRET: '5e6c9e7f9ac4937c359d93da8337f514',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};

