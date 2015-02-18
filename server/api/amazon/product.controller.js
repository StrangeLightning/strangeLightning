'use strict';

var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var OperationHelper = require('apac').OperationHelper;

var validationError = function(res, err) {
  return res.json(422, err);
};

exports.searchCart = function (req, res, next) {
  var opHelper = new OperationHelper({
    awsId:     config.amazon.clientID,
    awsSecret: config.amazon.clientSecret,
    assocId:   config.amazon.clientAccount
  });
  var t = new Date().getTime();
  //console.log(t);
  opHelper.execute('ItemSearch', {
      'Keywords': req.body.term,
      'SearchIndex': 'Blended',
      'ItemPage': '1',
      'ResponseGroup': 'Similarities,ItemIds,ItemAttributes,Images'
    }, function(err, results) {
      var _results = [];
      var r = results.ItemSearchResponse.Items[0];
      //console.log(r);
      var r2 = results.ItemSearchResponse.Items[0].Item;
      var i = 0;
      while (_results.length < 12) {
        var obj = r2[i];
        var product = {};
        // Sometimes no ItemAttributes Returned
        if (obj.ItemAttributes &&
            obj.ItemAttributes[0].ListPrice &&
            obj.ItemAttributes[0].Title &&
            obj.MediumImage) {
          product.id = obj.ASIN[0];
          product.price = obj.ItemAttributes[0].ListPrice[0].FormattedPrice[0];
          product.title = obj.ItemAttributes[0].Title[0];
          // product.smallImage = obj.SmallImage[0].URL[0];
          product.mediumImage = obj.MediumImage[0].URL[0];
          // product.largeImage = obj.LargeImage[0].URL[0];
          _results.push(product);
        }
        i++;
      }
      res.end(JSON.stringify({time: new Date().getTime() - t, data: _results}));
  });
};

