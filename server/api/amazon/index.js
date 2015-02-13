'use strict';

var express = require('express');
var controller = require('./product.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var util = require('util'),
    OperationHelper = require('apac').OperationHelper;
 
function test(req, res, next){
	console.log(config.amazon);
	console.log(config.amazon.clientID, "asdf");
	var opHelper = new OperationHelper({
	    awsId:     config.amazon.clientID,
	    awsSecret: config.amazon.clientSecret,
	    assocId:   config.amazon.clientAccount
	    // xml2jsOptions: an extra, optional, parameter for if you want to pass additional options for the xml2js module. (see https://github.com/Leonidas-from-XIV/node-xml2js#options) 
	});

	opHelper.execute('ItemSearch', {
	  'SearchIndex': 'Books',
	  'Keywords': 'harry potter'
	}, function(err, results) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js 
	    var r = JSON.stringify(results);
	    console.log(r);
	    res.end(r);
	});

}
var router = express.Router();

router.get('*', test);
// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', auth.isAuthenticated(), controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;