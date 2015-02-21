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
        $scope.$apply();
      };

      $scope.logout = function() {
        Auth.logout();
        $scope.cartQty = 0;
        $location.path('/login');
      };

      $scope.isActive = function(route) {
        return route === $location.path();
      };

      $scope.doSearch = function() {
        $location.path("/catalog");
        catalogFactory.doSearch($scope.searchTerm, function(newProducts) {
          catalogFactory.products = newProducts;
          $rootScope.$broadcast('products-updated', {newProducts: newProducts});
        });
        $scope.searchTerm = '';
      };

      //init

      //register to listen to keyboard events
      $rootScope.$on('keypress',function(onEvent, keypressEvent){
        var keyCode = keypressEvent.which;
        if(keyCode === 13) /* A */ {
          $scope.doSearch();
        }
      });

      $rootScope.$on('addToCart', $scope.increment);
      $rootScope.$on('clearCartQty', $scope.clearCart);
    }]);
