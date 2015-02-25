'use strict';

angular.module('thesisApp')
  .controller('NavbarCtrl', ['$rootScope', '$scope', '$location', '$http', 'Auth', 'catalogFactory', '$timeout',
    function($rootScope, $scope, $location, $http, Auth, catalogFactory, $timeout) {
      $scope.isCollapsed = true;
      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.isAdmin = Auth.isAdmin;
      $scope.getCurrentUser = Auth.getCurrentUser;
      $scope.cartQty = 0;
      $scope.suggestedProducts = [];

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

        // after search, clear out search term and suggested values
        // use set timeout with suggest products so that enter only triggers search when no suggested results found
        $timeout(function(){
          $scope.suggestedProducts = [];
          $scope.searchTerm = '';
        }, 200);
      };

      $scope.doSuggestor = function(searchTerm) {
        $scope.searchTerm = searchTerm;
        $location.path("/catalog");
        catalogFactory.doSuggestor(searchTerm, function(newProducts) {
         $scope.suggestedProducts = newProducts;
        });
      };

      //when enter pressed, trigger search if no suggestions given
      $rootScope.$on('keypress',function(onEvent, keypressEvent){
        var keyCode = keypressEvent.which;

        if(keyCode === 13 && $scope.suggestedProducts.length === 0) /* A */ {
          $scope.doSearch($scope.searchTerm);
        }
      });

      //init
      $rootScope.$on('addToCart', $scope.increment);
      $rootScope.$on('clearCartQty', $scope.clearCart);
    }]);
