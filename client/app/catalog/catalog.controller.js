'use strict';

angular.module('thesisApp')
  .controller('CatalogCtrl', function($scope, cartFactory, $http) {
    $scope.addToCart = cartFactory.addItem;

    $scope.getImage = function(product){
      var img = ;
      if(product.mediumImage){
        img = product.mediumImage;
      }
    };

    //init
    $http.get('/api/products/').
      success(function(data) {
        $scope.products = data;
      }).
      error(function(err) {
        console.log(err);
      });
  });
