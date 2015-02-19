angular.module('thesisApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('privacy', {
        url: '/privacy',
        templateUrl: 'app/privacy/privacy.html',
        controller: function () {
          $('#policyBox').css('height', (window.innerHeight * 0.9 - 100) + 'px');
        }
      })
  });
