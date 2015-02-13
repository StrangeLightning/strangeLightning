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
	});

	opHelper.execute('ItemSearch', {
	  'SearchIndex': 'Books',
	  'Keywords': 'harry potter'
	}, function(err, results) {
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