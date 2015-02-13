'use strict';

angular.module('thesisApp')
  .controller('VendorCtrl', function ($scope, User, Auth) {
    $scope.errors = {};
    $scope.minPasswordLength = 3;
    Auth.getCurrentUser().then(function(user) {
      $scope.user = user;
      $scope.isWorker = ($scope.user.account_type === 'Worker');
    });

    $scope.updateProfile = function(form) {
      if(form.$valid) {
        var updates = {
          name: $scope.user.name,
          location: $scope.user.location,
          email: $scope.user.email,
          img_url: Auth.getImages(),
          summary: $scope.user.summary,
          hourly_rate: $scope.user.hourly_rate,
          skills: $scope.user.skills,
          accountType: $scope.user.account_type
        };

        return Auth.editProfile(updates)
          .then(function(user) {
            $scope.message = 'Profile successfully updated.'
          })
          .catch(function(err) {
            $scope.message = 'Error updating profile. Please try again later.';
          });
      }
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
          .then(function() {
            $scope.message = 'Password successfully changed.';
          })
          .catch(function() {
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
  });
