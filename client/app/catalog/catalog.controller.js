'use strict';

angular.module('thesisApp')
  .controller('CatalogCtrl', ['$scope', '$rootScope', 'cartFactory', 'catalogFactory', '$http', '$location', function($scope, $rootScope, cartFactory, catalogFactory, $http, $location) {
    $scope.doSearch = catalogFactory.doSearch;

    $scope.facetFields = "";
    $scope.filterFields = "";
    $scope.selectedItems = [];
    $scope.from = 0;
    $scope.page = 1;
    $scope.prevPage = 1;
    $scope.noOfSuggests = 5;
    $scope.checked = [];
    $scope.filterFields = [];

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

    // Search by facet filter.
    $scope.doSearchByFilter = function(term, value) {
      $scope.page = 1;
      $scope.checked[value] = !$scope.checked[value];

      if($scope.checked[value]){
        $scope.filterFields.push({term : term, value: value});
      } else {
        $scope.filterFields.forEach(function(filter, i){
          if(filter.value == value){
            $scope.filterFields.splice(i, 1);
          }
        })
      }

      $scope.doSearch();
    };

    //INIT
    //initially, if products empty, then call search to show items
    if (!$scope.products) {
      $scope.doSearch('shoes', function(newProducts) {
        $scope.products = newProducts;
      });
    }

    //listen for products-updated event, which is broadcasted from navbar.controller.js
    $scope.$on('products-updated', function(event, args) {
      $scope.products = args.newProducts;
    });

    $scope.$on('search-in-progress', function(event, args) {
      $scope.products = [];
    })
  }]);
