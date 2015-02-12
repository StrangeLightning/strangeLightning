'use strict';

angular.module('thesisApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('showroom', {
        url: '/showroom',
        templateUrl: 'app/showroom/showroom.html',
        controller: 'ShowroomCtrl'
      });
  });