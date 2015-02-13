'use strict';

angular.module('thesisApp')
  .controller('VendorCtrl', function($scope, User, Auth) {
    $scope.errors = {};
    $scope.minPasswordLength = 3;
    $scope.user = Auth.getCurrentUser();
    $scope.isWorker = ($scope.user.account_type === 'Worker');

    $scope.updateProfile = function(form) {
      if(form.$valid) {
        var updates = {
          name: $scope.user.name,
          location: $scope.user.location,
          img_url: Auth.getImages()
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
  });
