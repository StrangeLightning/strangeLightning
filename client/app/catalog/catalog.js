'use strict';

angular.module('thesisApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('catalog', {
        url: '/catalog',
        templateUrl: 'app/catalog/catalog.html',
        controller: 'CatalogCtrl',
        params: { products: [] }
      });
  });
