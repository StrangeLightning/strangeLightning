'use strict';

var express = require('express');
var controller = require('./product.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var util = require('util'),
OperationHelper = require('apac').OperationHelper;

function test(req, res, next){
  // console.log(config.amazon.clientID, "asdf");
	var opHelper = new OperationHelper({
    1awsId:     config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId:   config.amazon.clientAccount 
	});
	console.log(config.amazon.clientID);
  opHelper.execute('ItemSearch', {
		'Keywords': req.body.term,
		'SearchIndex': 'Blended',
		'ResponseGroup': 'Similarities,ItemIds,Images,Small'
	}, function(err, results) {
		console.log(results);
		// var r = results.ItemSearchResponse.Items[0].Item[0];
		// var r = JSON.stringify(results.ItemSearchResponse);
		res.end(JSON.stringify(results));
 //    opHelper.execute('ItemLookup', {
	//   'ItemId': r.Item[0].ASIN,
	//   'ResponseGroup': 'Images'
	// }, function(err, results) {
	// 	// var r = results.ItemSearchResponse.Items[0];
	//     // var r = JSON.stringify(results.ItemSearchResponse);
	//     res.end(JSON.stringify(results));
	// });
});

}
var router = express.Router();

router.get('*', test);
// router.get('/', controller.index);
// router.get('/:id', controller.show);
router.post('*', test);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;