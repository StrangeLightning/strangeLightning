'use strict';

angular.module('thesisApp')
  .factory('facet', function() {
    var facet = {};

    facet.getFacets = function(searchTerm, callback) {
      return $http.post('/api/amazonproducts/', {
        q: searchTerm,
        facets: 'category',
        limit: 0
      })
        .success(function(results) {
          callback(results.data);
        })
        .error(function(err) {
          console.log(err);
        });
    };

    return facet;
  });
