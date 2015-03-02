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

    // $scope.close = function() {
    //   $('#cart').animate({
    //     'margin-right': '-=1000'
    //   }, 500);
    // }



  // $window.onAmazonLoginReady = function() {
  //   amazon.Login.setClientId('YOUR-CLIENT-ID');
  // };
  // (function(d) {
  //   var a = d.createElement('script');
  //   a.type = 'text/javascript';
  //   a.async = true;
  //   a.id = 'amazon-login-sdk';
  //   a.src = 'https://api-cdn.amazon.com/sdk/login1.js';
  //   d.getElementById('amazon-root').appendChild(a);
  // })(document);



  // $scope.LoginWithAmazon = function() {
  //   var options = {
  //     scope: 'profile'
  //   };
  //   amazon.Login.authorize(options,
  //     'https://sphereable.com/handle_login.php');
  //   return false;
  // };
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
  });