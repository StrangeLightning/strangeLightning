'use strict';

angular.module('thesisApp')
  .controller('LoginCtrl', function($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    /* Set height of window */
    var block = $(window).height();
    var navbar = $('.navbar').height();
    $('#login').css({
      height: block - navbar - 1
    });

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });