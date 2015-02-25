'use strict';

angular.module('thesisApp')
  .controller('NavbarCtrl', ['$rootScope', '$scope', '$location', '$http', 'Auth', 'catalogFactory', 'cartFactory',
    function($rootScope, $scope, $location, $http, Auth, catalogFactory, cartFactory) {
      $scope.isCollapsed = true;
      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.isAdmin = Auth.isAdmin;
      $scope.getCurrentUser = Auth.getCurrentUser;
      $scope.cartQty = 0;

      $scope.increment = function () {
        $scope.cartQty++;
      };

      $scope.clearCart = function () {
        $scope.cartQty = 0;
      };

      $scope.logout = function() {
        Auth.logout();
        $scope.cartQty = 0;
        $location.path('/login');
      };

      $scope.isActive = function(route) {
        return route === $location.path();
      };

      $scope.doSearch = function(searchTerm) {
        $scope.searchTerm = searchTerm;
        $location.path("/catalog");
        catalogFactory.doSearch(searchTerm, function(newProducts) {
          $rootScope.$broadcast('products-updated', {newProducts: newProducts});
        });
        $scope.searchTerm = '';
      };

      $scope.doSuggestor = function(searchTerm) {
        $scope.searchTerm = searchTerm;
        $location.path("/catalog");
        catalogFactory.doSuggestor(searchTerm, function(newProducts) {
         $scope.suggestedProducts = newProducts;
        });
      };

      //init
      $rootScope.$on('addToCart', $scope.increment);
      $rootScope.$on('clearCartQty', $scope.clearCart);
    }]);
