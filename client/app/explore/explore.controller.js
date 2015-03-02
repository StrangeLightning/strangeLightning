'use strict';

angular.module('thesisApp')
  .controller('ExploreCtrl', function ($scope) {
    $scope.isHidden = false;

    $scope.hideLoadScreen = function(){
      $scope.isHidden = true;
    };
  });
