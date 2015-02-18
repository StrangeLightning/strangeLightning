'use strict';

angular.module('thesisApp')
  .controller('CatalogCtrl', function($scope, $http) {
    $scope.addToCart = function(item) {
      consol.log(item)
    }
  });