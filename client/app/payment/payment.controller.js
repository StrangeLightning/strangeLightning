'use strict';

angular.module('thesisApp', ['angularPayments'])

  .config(function($window){
  	window.Stripe.setPublisherKey('sk_test_rXKrpnmDrCVoayVPQkFXDFUw')
  })
  .controller('PaymentCtrl', function ($scope) {
    console.log('IN PAYMENT CONTROLLER')
    $scope.stripeCallback = function(code, result){
    	if (result.error){
    		window.alert('CC Auth failed: ' + result.error.message)
    	} else {
    		window.alert('CC Auth success token: ' + result.id)
    	}
  	}
  });
