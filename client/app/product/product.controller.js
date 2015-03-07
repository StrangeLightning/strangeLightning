'use strict';

angular.module('thesisApp')
  .controller('ProductCtrl', ['$rootScope', '$scope', 'catalogFactory', 'cartFactory', 'localStorageService',
    function($rootScope, $scope, catalogFactory, cartFactory, localStorageService) {
      // If coming from the catalog screen, get product from click event.
      // Else, get previously stored product from local storage
      if(catalogFactory.product){
        $scope.product = catalogFactory.product;
      } else {
        $scope.product = localStorageService.get("product.view");
      }

      // If product not stored / updated in local storage, do so now
      if($scope.product && !localStorageService.get("product.view")){
        localStorageService.add("product.view", $scope.product);
      } else if (localStorageService.get("product.view") !== $scope.product){
        localStorageService.remove("product.view");
        localStorageService.add("product.view", $scope.product);
      }

      // Call add product method from cart factor, and broadcast addToCart message to listeners
      $scope.addToCart = function(product) {
        $rootScope.$broadcast('addToCart');
        if(cartFactory.amazonCart.items) {
          cartFactory.amazonAddProduct(product, cartFactory.amazonCart)
        } else {
          cartFactory.amazonCreateCart(product);
        }
      };

      $scope.viewItem = function(product) {
        catalogFactory.product = product;
        catalogFactory.viewItem(product);
      };

      var block = $(window).height();
      var navbar = $('.navbar').height();
      $('#product-container').css({
        height: block - navbar
      });
    }]);
