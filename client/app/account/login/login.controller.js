'use strict';

angular.module('thesisApp')
  .controller('LoginCtrl', function($scope, Auth, $location, $window, $http) {
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


    //verifies public client key to amazon API
    $window.onAmazonLoginReady = function() {
      $http.get('auth/amazon/publicClientAuth').success(function(data) {
        amazon.Login.setClientId(data)
          //Loads Amazon SDK
          (function(d) {
            var authenticate = d.createElement('script');
            authenticate.type = 'text/javascript';
            authenticate.async = true;
            authenticate.id = 'amazon-login-sdk';
            authenticate.src = 'https://api-cdn.amazon.com/sdk/login1.js';
            d.getElementById('amazon-root').appendChild(authenticate);
          })(document);
      })

    }
    $scope.amazonLogin = function() {
        var options = {
          scope: 'profile'
        };
        amazon.Login.authorize(options, function(response) {
          if (response.error) {
            alert('oauth error ' + response.error);
            return;
          }
          amazon.Login.retrieveProfile(response.access_token, function(response) {
            console.log(response);
          })
        });
        // return false;
      }
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