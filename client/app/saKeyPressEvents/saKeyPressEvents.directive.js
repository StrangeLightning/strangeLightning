'use strict';

// Listen for all keypress events in app, and broadcast those
angular.module('thesisApp')
  .directive("ipKeypressEvents", function($document, $rootScope)
  {
    return(
    {
      restrict: "E",
      link: function()
      {
        $document.bind('keyup', function(e)
        {
          console.log('Got keypress:', e.which);
          $rootScope.$broadcast('keypress', e);
          $rootScope.$broadcast('keypress:' + e.which, e);

          ///////////////////////////////////
          // Firefox window.event polyfill //
          ///////////////////////////////////
          if(!window.event)
          {
            window.event = e;
          }
        });

        $document.bind('mousedown touchstart click', function(e)
        {
          ///////////////////////////////////
          // Firefox window.event polyfill //
          ///////////////////////////////////
          if(!window.event)
          {
            window.event = e;
          }
        });
      }
    });
  });
