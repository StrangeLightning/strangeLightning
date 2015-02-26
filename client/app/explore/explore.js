'use strict';

angular.module('thesisApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('explore', {
        url: '/',
        templateUrl: 'app/explore/explore.html',
        controller: 'ExploreCtrl'
      });
  });
