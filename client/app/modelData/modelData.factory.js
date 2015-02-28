angular.module('thesisApp')
  .factory('modelData', function($resource) {
    return $resource('app/modelData/modelToCategoryMap.json', {}, {
      get: {method: 'GET'}
    });
  });
