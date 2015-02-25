angular.module('thesisApp.filter', [])
  .filter('trust', function($sce) {
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  });
