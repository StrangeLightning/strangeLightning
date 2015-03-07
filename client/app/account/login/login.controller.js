'use strict';

angular.module('thesisApp')
  .controller('LoginCtrl', ['$scope', 'Auth', '$location', '$window', '$document', '$http', function($scope, Auth, $location, $window, $document, $http) {
    $scope.user = {};
    $scope.errors = {};

    /* Set height of window */
    var block = $(window).height();
    var navbar = $('.navbar').height();
    $('#login').css({
      height: block - navbar - 1
    });

    $scope.login = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
            email: $scope.user.email,
            password: $scope.user.password
          })
          .then(function() {
            // Logged in, redirect to home
            $location.path('/');
          })
          .catch(function(err) {
            $scope.errors.other = err.message;
          });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  }]);