'use strict';

angular.module('thesisApp')
  .controller('CatalogCtrl', ['$scope', 'cartFactory', 'catalogFactory', '$http', function($scope, cartFactory, catalogFactory, $http) {
    $scope.addToCart = cartFactory.addItem;
    $scope.viewItem = function(product) {
      catalogFactory.product = product;
      catalogFactory.viewItem(product);
    }
    $scope.getImage = function(product) {
      var img = "https://s3-eu-west-1.amazonaws.com/petrus-blog/placeholder.png";
      if (product.mediumImage) {
        img = product.mediumImage;
      }

      return img;
    };

    //init
    $http.post('/api/amazonproducts/').
    success(function(results) {
      $scope.products = results.data;
    }).
    error(function(err) {
      console.log(err);
    });
  }])
  .factory('catalogFactory', ['$location', function($location) {
    var catalog = {};
    catalog.viewItem = function() {
      $location.path('/product');
    }

    return catalog;
  }])