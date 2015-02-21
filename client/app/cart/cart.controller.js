'use strict';

angular.module('thesisApp')
  .controller('CartCtrl', ['$scope', '$rootScope', '$state', 'cartFactory', 'Auth',
    function($scope, $rootScope, $state, cartFactory, Auth) {
      //where local items are stored
      $scope.user = Auth.getCurrentUser().email;
      $scope.items = 0;

      //returns all items from db schema,
      $scope.getItems = function() {
        cartFactory.amazonGetCart(function(data){
          if(data.CartItems && data.CartItems[0] && data.CartItems[0].CartItem){
            $scope.purchaseUrl = data.PurchaseURL[0];
            $scope.subTotal = data.SubTotal[0].FormattedPrice[0];
            $scope.items = data.CartItems[0].CartItem || [];
          }
        });
      };

      //add item to db
      $scope.addItem = function(item) {

      };

      //remove item locally and from db
      $scope.removeItem = function(items, item) {

      };

      //clear items locally and drop schema
      $scope.dropSchema = function() {
        $scope.items = 0;
        $scope.subTotal = "$0.00";
        cartFactory.amazonClearCart();
        $rootScope.$broadcast('clearCartQty');
      };

      /* Set height of window */
      var block = $(window).height();
      var navbar = $('.navbar').height();
      $('#cart').css({
        height: block - navbar - 1
      });

      $scope.close = function() {
        $('#cart').animate({
          'margin-right': '-=1000'
        }, 500);
        $state.transitionTo('catalog');
      };

      //open Amazon cart in a new tab
      $scope.goToAmazonCart = function(){
        window.open(
          $scope.purchaseUrl,
          '_blank' // <- This is what makes it open in a new window.
        );
      };

      //init
      $scope.getItems();

    }
  ]);
