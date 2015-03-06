'use strict';

var cloudsearchdomain = require(__dirname + "/../../config/endpoints").cloudsearchdomain;

exports.searchCart = function(req, res) {
  var params = {};
  params.size = req.body.limit || 10;
  params.start = req.body.start || 0;
  params.partial = true;

  if(typeof req.body.q === "undefined" || req.body.q === "" || req.body.filters) {
    params.queryParser = 'simple';

    // build text query
    if(req.body.q) {
      params.query = req.body.q ? req.body.q : "~1";
    } else {
      params.queryParser = 'structured';
      params.query = "(matchall)";
    }

    //build facet query
    if(req.body.filters && req.body.filters.length > 0) {
      var filtersArray = req.body.filters;
      var filterHolder = {};
      filtersArray.forEach(function(filter) {
        //group filters by term
        if(filterHolder[filter.term] && filterHolder[filter.term].length > 0) {
          filterHolder[filter.term].push(filter.value);
        } else {
          filterHolder[filter.term] = [];
          filterHolder[filter.term].push(filter.value);
        }
      });

      params.filterQuery = "(and ";
      for(var key in filterHolder) {
        params.filterQuery += "(or ";
        filterHolder[key].forEach(function(value) {

          // check if range query or facet filter term query
          if(key === 'price' || key === 'x' || key === 'y' || key === 'z'){
            params.filterQuery += '( range field=' + key + ' ' +  value + ')';
          } else {
            params.filterQuery += key + ":'" + value + "' ";
          }
        });
        params.filterQuery += ") ";
      }
      params.filterQuery += ")";
    }
  } else {
    params.query = req.body.q;
    params.queryParser = 'simple';
  }

  // add sorting parameter
  if(typeof req.body.sort !== "undefined") {
    params.sort = req.body.sort;
  }

  // only add facets to params if params sent in request
  if(typeof req.body.facets !== "undefined") {
    params.facet = function() {
      var facets = req.body.facets.split(",") || [];
      var facetsString = "{";
      for(var i = 0; i < facets.length; i++) {
        facetsString += '"' + facets[i] + '":{"sort":"bucket", "size":25}';

        if(i !== facets.length - 1) {
          facetsString += ",";
        }
      }
      facetsString += "}";

      return facetsString;
    }()
  }

  //console.log(params);
  cloudsearchdomain.search(params, function(err, data) {
    if(err) {
      res.json(err);
      console.log(err, err.stack);
    } else {
      var _results = {};
      _results.results = [];

      //add total results found
      _results.totalCount = data.hits.found;

      //add facets
      _results.facets = data.facets;

      var isData = data.hits.hit.length > 0;
      if(isData) {
        for(var i = 0; i < data.hits.hit.length; i++) {
          var product = {};
          var result = data.hits.hit[i];

          //add fields
          product.id = result.fields.product_id[0];
          product.price = result.fields.price[0];
          product.title = result.fields.title[0];
          product.mediumImage = result.fields.img_url[0];
          product.category = result.fields.category[0];
          product.prodAttributes = JSON.parse(result.fields.prod_attributes[0]);
          product.x = result.fields.x[0];
          product.y = result.fields.y[0];
          product.z = result.fields.z[0];
          product.depth = result.fields.depth[0];

          _results.results.push(product);

          if(_results.results.length === data.hits.hit.length - 1) {
            res.end(JSON.stringify({
              data: _results
            }));
          }
        }
      } else {
        res.end(JSON.stringify({
          data: []
        }));
      }
    }
  })
};

exports.suggest = function(req, res) {
  var params = {
    query: req.body.q, /* required */
    suggester: 'title', /* required */
    size: 10
  };

  if(req.body.q) {
    cloudsearchdomain.suggest(params, function(err, data) {
      if(err) {
        res.json(err);
        console.log(err, err.stack);
      } else {
        var _results = [];
        var isData = data.suggest.suggestions.length > 0;
        if(isData) {

          for(var i = 0; i < data.suggest.suggestions.length; i++) {
            var product = {};
            var result = data.suggest.suggestions[i];
            product.title = result.suggestion;
            _results.push(product);

            if(_results.length === data.suggest.suggestions.length - 1) {
              res.end(JSON.stringify({
                data: _results
              }));
            }
          }
        } else {
          res.end(JSON.stringify({
            data: []
          }));
        }
      }
    });
  } else {
    res.end(JSON.stringify({
      data: []
    }));
  }
};
