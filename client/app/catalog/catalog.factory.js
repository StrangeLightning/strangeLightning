'use strict';

angular.module('thesisApp')
  .factory('catalogFactory', ['$location', '$http', '$rootScope', function($location, $http, $rootScope) {
    var catalog = {};
    catalog.viewItem = function() {
      $location.path('/product');
    };

    catalog.doSearch = function(searchTerm, pageNumber, filters, callback) {
      $rootScope.$broadcast('search-in-progress');
      return $http.post('/api/amazonproducts/', {
        q: searchTerm,
        facets: 'category,price',
        start: pageNumber,
        filters: filters
      })
        .success(function(results) {
          callback(results.data);
        })
        .error(function(err) {
          console.log(err);
        });
    };

    catalog.doSuggestor = function(searchTerm, callback) {
      return $http.post('/api/amazonproducts/suggest/', {
        q: searchTerm
      })
        .success(function(results) {
          callback(results.data);
        })
        .error(function(err) {
          console.log(err);
        });
    };

    return catalog;
  }]);
