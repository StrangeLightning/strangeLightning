'use strict';

angular.module('thesisApp')
  .factory('catalogFactory', ['$location', '$http', '$rootScope', function ($location, $http, $rootScope) {
    var catalog = {};
    catalog.viewItem = function () {
      $location.path('/product');
    };

    catalog.doSearch = function (searchTerm, callback) {
      $rootScope.$broadcast('search-in-progress');
      return $http.post(catalog.getUrlParams('/api/amazonproducts/'), {
          q: searchTerm || 'harry'
        })
        .success(function (results) {
          callback(results.data);
        })
        .error(function (err) {
          console.log(err);
        });
    };

    catalog.doSuggestor = function (searchTerm, callback) {
      return $http.post(catalog.getUrlParams('/api/amazonproducts/suggest'), {
          q: searchTerm || 'harry'
        })
        .success(function (results) {
          callback(results.data);
        })
        .error(function (err) {
          console.log(err);
        });
    };

    // function for generating url
    catalog.getUrlParams = function (url, query, facets, filterFields, sort, start) {
      var urlParam = url + "?";

      if (typeof (query) !== "undefined" && query !== null) {
        urlParam = urlParam + "&q=" + encodeURIComponent(query);
      }

      if (typeof (facets) !== "undefined" && facets !== null) {
        urlParam = urlParam + "&facets=" + encodeURIComponent(facets);
      }

      if (filterFields && filterFields.length > 0) {
        urlParam = urlParam + "&filters=" + encodeURIComponent(JSON.stringify(filterFields));
      }

      if (typeof (sort) !== "undefined" && sort !== null) {
        urlParam = urlParam + "&sort=" + encodeURIComponent(sort);
      }

      if (typeof (start) !== "undefined" && start !== null) {
        urlParam = urlParam + "&start=" + encodeURIComponent(start);
      }

      return urlParam;
    };

    return catalog;
  }]);
