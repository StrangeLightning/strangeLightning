'use strict';

angular.module('thesisApp')
  .controller('CartCtrl', ['$scope', '$rootScope', '$state', 'cartFactory', 'Auth',
    function($scope, $rootScope, $state, cartFactory, Auth) {
      //where local items are stored
      $scope.user = Auth.getCurrentUser().email;
      $scope.items = 0;
      // $scope.rem
      $scope.removeFromCart = function(product) {
        if (cartFactory.amazonCart) {
          console.log("cart state at remove", product)
          cartFactory.amazonRemoveProduct(product, cartFactory.amazonCart)
            .success(function(data) {
              if (data.CartItems && data.CartItems[0] && data.CartItems[0].CartItem) {
                $scope.purchaseUrl = data.PurchaseURL[0];
                $scope.subTotal = data.SubTotal[0].FormattedPrice[0];
                $scope.items = data.CartItems[0].CartItem || [];
              } else {
                $scope.purchaseUrl = '';
                $scope.subTotal = '$0';
                $scope.items = [];
              }
            })
            .error(function(err) {
              console.log("ERROR removing Cart ", err)
            });
          // function(cartFactory.amazonRemoveProduct(product, crartFactory.amazonCart), function($scope.getItems()))()

        }
        // else {
        //   console.log("item not in cart");
        // }
      };
      $scope.emptyCart = function() {
        $scope.items = 0;
        // Clears the subTotal from the total if the cart has been emptied.
        $scope.subTotal = '$0';
        $rootScope.$broadcast('clearCartQty');
        cartFactory.amazonClearCart();
      };

      //returns all items from db schema,
      $scope.getItems = function() {
        cartFactory.amazonGetCart(function(data) {
          if (data.CartItems && data.CartItems[0] && data.CartItems[0].CartItem) {
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
      $scope.goToAmazonCart = function() {
        window.open(
          $scope.purchaseUrl,
          '_blank' // <- This is what makes it open in a new window.
        );
      };

      //init
      $scope.getItems();

    }
  ]);
