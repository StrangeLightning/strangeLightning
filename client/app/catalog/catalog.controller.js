'use strict';

angular.module('thesisApp')
  .controller('CatalogCtrl', ['$scope', '$rootScope', 'cartFactory', 'catalogFactory', '$http', '$location', '$stateParams', function ($scope, $rootScope, cartFactory, catalogFactory, $http, $location, $stateParams) {
    $scope.selectedItems = [];
    $scope.from = 0;
    $scope.page = 1;
    $scope.prevPage = 1;
    $scope.noOfSuggests = 5;
    $scope.checked = [];
    $scope.filterFields = [];
    $scope.searchInProgress = true;
    $scope.amazonCart = cartFactory.amazonCart;
    $scope.clickLimit = 5;
    $scope.showMoreFacets = true;
    $scope.startPriceFilter = 0;
    $scope.endPriceFilter = 0;
    $scope.products = {};

    $scope.removeFromCart = function (product) {
      if (cartFactory.amazonCart.items) {
        cartFactory.amazonRemoveProduct(product.id, cartFactory.amazonCart)
      } else {
        console.log("Item not in cart");
      }
    };

    $scope.addToCart = function (product) {
      $rootScope.$broadcast('addToCart');
      if (cartFactory.amazonCart.items) {
        cartFactory.amazonAddProduct(product, cartFactory.amazonCart)
      } else {
        cartFactory.amazonCreateCart(product);
      }
    };

    $scope.viewItem = function (product) {
      catalogFactory.product = product;
      $rootScope.$broadcast('showcaseProduct', product);
      //catalogFactory.viewItem(product);
    };

    $scope.getImage = function (product) {
      var img = "https://s3-eu-west-1.amazonaws.com/petrus-blog/placeholder.png";
      if (product.mediumImage) {
        img = product.mediumImage;
      }

      return img;
    };

    // Search by facet filter.
    $scope.doSearchByFilter = function (term, value) {
      $scope.checked[value] = !$scope.checked[value];

      if ($scope.checked[value]) {
        $scope.filterFields.push({
          term: term,
          value: value
        });
      } else {
        $scope.filterFields.forEach(function (filter, i) {
          if (filter.value === value) {
            $scope.filterFields.splice(i, 1);
          }
        })
      }

      $scope.doSearch($scope.searchTerm, 0, $scope.filterFields, null, null);
    };

    $scope.doSearch = function (searchTerm, pageNumber, filterFields) {
      pageNumber = pageNumber || 0;
      $scope.filterFields = filterFields || [];
      $scope.searchTerm = searchTerm;
      catalogFactory.doSearch(searchTerm, pageNumber, $scope.filterFields, null, null, null)
        .success(function(results) {
          catalogFactory.newSearch = false;
          $rootScope.$broadcast('products-updated');
          $scope.products = catalogFactory.processFacets(results.data);
        })
        .error(function(err) {
          console.log(err);
        });
    };

    // Function for fetch page results.
    $scope.fetchPage = function (searchTerm, pageNumber) {
      pageNumber = (pageNumber - 1) * 12;
      $scope.doSearch(searchTerm, pageNumber, null, null, null);
    };

    // Function to sort by price
    $scope.doPriceSort = function () {
      //remove existing price filter, if exists
      $scope.filterFields.forEach(function (filter, i) {
        if (filter.term === 'price') {
          $scope.filterFields.splice(i, 1);
        }
      });

      // filter by price range
      $scope.doSearchByFilter('price', '[' + $scope.startPriceFilter + ',' + $scope.endPriceFilter + ']');
    };

    // ajax call to show more favorite records
    $scope.showMoreFacetLinks = function (numberToShow) {
      // toggle to "Show Less"
      $scope.showMoreFacets = false;

      // set limit filter for ng-repeat
      $scope.clickLimit = numberToShow;
    };

    // ajax call to show less favorite records
    $scope.showLessFacetLinks = function () {
      // toggle to "Show More"
      $scope.showMoreFacets = true;

      // set limit filter for ng-repeat
      $scope.clickLimit = 5;
    };

    // Initialize
    // if products empty, then call search to show items
    if (catalogFactory.newSearch) {
      $scope.doSearch('', 0, null, null, null);
    }

    if($stateParams.products.results){
      $scope.products = $stateParams.products;
      $scope.searchInProgress = false;
    }

    // listen for products-updated event, which is broadcasted from navbar.controller.js
    $scope.$on('products-updated', function (event, args) {
      $scope.searchInProgress = false;
    });

    $scope.$on('search-in-progress', function (event, args) {
      $scope.products.results = [];
      $scope.products.totalCount = 0;
      $scope.searchInProgress = true;
    })
  }]);
