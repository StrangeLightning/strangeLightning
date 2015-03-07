angular.module('thesisApp')
  .directive('showcaseCart', function (cartFactory) {
    return {
      restrict: 'E',
      templateUrl: 'app/cart/cart.html',
      link: function (scope) {

      }
    }
  });
