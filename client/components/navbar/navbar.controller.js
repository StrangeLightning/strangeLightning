'use strict';

angular.module('thesisApp')
  .controller('NavbarCtrl', ['$rootScope', '$scope', '$location', '$http', 'Auth', 'catalogFactory', '$timeout', '$state', 'localStorageService',

    function($rootScope, $scope, $location, $http, Auth, catalogFactory, $timeout, $state, localStorageService) {
      $scope.isCollapsed = true;
      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.isAdmin = Auth.isAdmin;
      $scope.getCurrentUser = Auth.getCurrentUser;
      if (localStorageService.get('Cart')) {
        $scope.cartQty = localStorageService.get('Cart')['Qty'] || 0;
      }
      $scope.suggestedProducts = [];

      $rootScope.$on('changeCartQuantity', function() {
        $scope.cartQty = localStorageService.get('Cart')['Qty'];
      });

      $scope.logout = function() {
        Auth.logout();
        if (localStorageService.get('Cart')) {
          localStorageService.set('Cart', null)
        }

        $scope.cartQty = 0;
        $location.path('/login');
      };

      $scope.isActive = function(route) {
        return route === $location.path();
      };

      $scope.doSearch = function(searchTerm, pageNumber) {
        pageNumber = pageNumber || 0;
        $scope.searchTerm = searchTerm;
        catalogFactory.doSearch(searchTerm, pageNumber, null, null, true)
          .success(function(results) {
            catalogFactory.newSearch = false;
            $rootScope.$broadcast('products-updated');
            $state.go('catalog', { products : results.data});
          })
          .error(function(err) {
            console.log(err);
          });
      };

      $scope.doSuggestor = function(searchTerm) {
        $scope.searchTerm = searchTerm;
        catalogFactory.doSuggestor(searchTerm, function(newProducts) {
          $scope.suggestedProducts = newProducts;
        });
      };

      //when enter pressed, trigger search if no suggestions given
      $rootScope.$on('keypress', function(onEvent, keypressEvent) {
        var keyCode = keypressEvent.which;

        if (keyCode === 13 && $scope.searchTerm) {
          $scope.doSearch($scope.searchTerm);
        }
      });

      //init
      $rootScope.$on('addToCart', $scope.increment);
      $rootScope.$on('clearCartQty', $scope.clearCart);
    }
  ]);
