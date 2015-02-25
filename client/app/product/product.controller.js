'use strict';

angular.module('thesisApp')
  .controller('ProductCtrl', ['$scope', 'catalogFactory', function($scope, catalogFactory) {
    // This should go into a directive but since it's only 6 lines of code
    // we can leave this here and migrate it inside of a directive should
    // we have a need to create one.
    $scope.product = catalogFactory.product;
    //$scope.product.prodAttributes = JSON.parse($scope.product.prodAttributes);

    var block = $(window).height();
    var navbar = $('.navbar').height();
    $('#product-container').css({
      height: block - navbar
    });

    $scope.close = function() {
      $('#product-container').animate({
        'margin-right': '-=1000'
      }, 500);
    }
  }]);
