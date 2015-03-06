'use strict';

angular.module('thesisApp')
  .controller('CatalogCtrl', ['$scope', '$rootScope', 'cartFactory', 'catalogFactory', '$http', '$location', function ($scope, $rootScope, cartFactory, catalogFactory, $http, $location) {
    $scope.facetFields = "";
    $scope.filterFields = "";
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

    $scope.removeFromCart = function (product) {
      if (cartFactory.amazonCart.items) {
        console.log("Product FROM REmove on catalog", product);
        cartFactory.amazonRemoveProduct(product.id, cartFactory.amazonCart)
      } else {
        console.log("item not in cart");
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
      catalogFactory.viewItem(product);
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

      $scope.doSearch($scope.searchTerm, 0, $scope.filterFields);
    };

    $scope.doSearch = function (searchTerm, pageNumber, filterFields) {
      pageNumber = pageNumber || 0;
      filterFields = filterFields || null;
      $scope.searchTerm = searchTerm;
      $location.path("/catalog");
      catalogFactory.doSearch(searchTerm, pageNumber, filterFields, null, function (newProducts) {
        newProducts = catalogFactory.processFacets(newProducts);
        $rootScope.$broadcast('products-updated', {
          newProducts: newProducts
        });
      });
    };

    // Function for fetch page results.
    $scope.fetchPage = function (searchTerm, pageNumber) {
      pageNumber = (pageNumber - 1) * 12;
      $scope.doSearch(searchTerm, pageNumber);
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

    //ajax call to show more favorite records
    $scope.showMoreFacetLinks = function (numberToShow) {
      // toggle to "Show Less"
      $scope.showMoreFacets = false;

      // set limit filter for ng-repeat
      $scope.clickLimit = numberToShow;
    };

    //ajax call to show less favorite records
    $scope.showLessFacetLinks = function () {
      // toggle to "Show More"
      $scope.showMoreFacets = true;

      // set limit filter for ng-repeat
      $scope.clickLimit = 5;
    };

    //INIT
    //initially, if products empty, then call search to show items
    if (!$scope.products) {
      $scope.doSearch('', 0, function (newProducts) {
        $scope.products = newProducts;
      });
    }

    //listen for products-updated event, which is broadcasted from navbar.controller.js
    $scope.$on('products-updated', function (event, args) {
      $scope.products = args.newProducts;
      $scope.searchInProgress = false;
    });

    $scope.$on('search-in-progress', function (event, args) {
      $scope.products.results = [];
      $scope.products.totalCount = 0;
      $scope.searchInProgress = true;
    })
  }]);
