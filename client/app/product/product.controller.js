'use strict';

angular.module('thesisApp')
  .controller('ProductCtrl', function($scope) {
    // This should go into a directive but since it's only 6 lines of code
    // we can leave this here and migrate it inside of a directive should
    // we have a need to create one.
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
  });