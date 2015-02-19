'use strict';

angular.module('thesisApp')
  .controller('NavbarCtrl', ['$rootScope', '$scope', '$location', '$http', 'Auth', 'catalogFactory',
    function($rootScope, $scope, $location, $http, Auth, catalogFactory) {
      $scope.isCollapsed = true;
      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.isAdmin = Auth.isAdmin;
      $scope.getCurrentUser = Auth.getCurrentUser;

      $scope.logout = function() {
        Auth.logout();
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
      }

    }]);
