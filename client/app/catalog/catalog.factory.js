'use strict';

angular.module('thesisApp')
  .factory('catalogFactory', ['$location', '$http', '$rootScope', function($location, $http, $rootScope) {
    var catalog = {};
    catalog.viewItem = function() {
      $location.path('/product');
    };

    catalog.doSearch = function(searchTerm, callback) {
      $rootScope.$broadcast('search-in-progress');
      return $http.post('/api/amazonproducts/', {
        term: searchTerm
      })
        .success(function(results) {
          callback(results.data);
        })
        .error(function(err) {
          console.log(err);
        });
    };

    catalog.doSuggestor = function(searchTerm, callback) {
      return $http.post('/api/amazonproducts/', {
        term: searchTerm
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
