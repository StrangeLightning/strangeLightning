'use strict';

angular.module('thesisApp')
  .controller('CatalogCtrl', function($scope, cartFactory, $http) {
    $scope.addToCart = cartFactory.addItem;

    $scope.getImage = function(product){
      var img = "https://s3-eu-west-1.amazonaws.com/petrus-blog/placeholder.png";
      if(product.mediumImage){
        img = product.mediumImage;
      }

      return img;
    };

    //init
    $http.post('/api/amazon-products/').
      success(function(results) {
        $scope.products = results.data;
      }).
      error(function(err) {
        console.log(err);
      });
  });
