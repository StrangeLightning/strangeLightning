'use strict';

angular.module('thesisApp')
  .directive('saSetHeightDirective', function () {
    return {
      restrict: 'A',
      scope: {
        identifier: '@'
      },
      link: function (scope, element, attrs) {
        scope.element = $(scope.identifier);
      },
      controller: function($window, $rootScope, $scope)
      {
        $scope.windowWidth = $window.outerWidth;

        angular.element($window).bind('resize', function()
        {
          $scope.windowWidth = $window.outerWidth;
          $scope.$apply('windowWidth');
        });

        $scope.$watch('windowWidth', function()
        {
          resetHeight();
        });

        var resetHeight = function()
        {
          $scope.element.height($(window).height() - $('nav.navbar').height() - $scope.element.offset().top);
        };
      }
    };
  });
