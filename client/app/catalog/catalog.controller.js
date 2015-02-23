'use strict';

angular.module('thesisApp')
  .controller('CatalogCtrl', ['$scope', '$rootScope', 'cartFactory', 'catalogFactory', '$http', '$location', function($scope, $rootScope, cartFactory, catalogFactory, $http, $location) {


    $scope.removeFromCart = function(product) {
      if (cartFactory.amazonCart.items) {
        console.log("Product FROM REmove on catalog", product)
        cartFactory.amazonRemoveProduct(product.id, cartFactory.amazonCart)
      } else {
        console.log("item not in cart");
      }
    }
    $scope.addToCart = function(product) {
      $rootScope.$broadcast('addToCart');
      if (cartFactory.amazonCart.items) {
        cartFactory.amazonAddProduct(product, cartFactory.amazonCart)
      } else {
        cartFactory.amazonCreateCart(product);
      }
    };

    $scope.amazonCart = cartFactory.amazonCart;
    $scope.getCartItems = function() {
      $location.path("/cart");
    };

    $scope.viewItem = function(product) {
      catalogFactory.product = product;
      catalogFactory.viewItem(product);
    };

    $scope.getImage = function(product) {
      var img = "https://s3-eu-west-1.amazonaws.com/petrus-blog/placeholder.png";
      if (product.mediumImage) {
        img = product.mediumImage;
      }

      return img;
    };

    //initially, if products empty, then call search to show items
    if (!$scope.products) {
      catalogFactory.doSearch('shoes', function(newProducts) {
        $scope.products = $scope.products || newProducts;
      });
    }

    //listen for products-updated event, which is broadcasted from navbar.controller.js
    $scope.$on('products-updated', function(event, args) {
      $scope.products = args.newProducts;
    });

    $scope.$on('search-in-progress', function(event, args) {
      $scope.products = [];
    })
  }])

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

  return catalog;
}]);