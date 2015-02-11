'use strict';

angular.module('thesisApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('vendor', {
        url: '/vendor',
        templateUrl: 'app/vendor/vendor.html',
        controller: 'VendorCtrl'
      });
  });