'use strict';

angular.module('thesisApp')
  .controller('CartCtrl', ['$scope', '$state', 'cartFactory', 'Auth',
    function($scope, $state, cartFactory, Auth) {

      //where local items are stored

      $scope.items = cartFactory.amazonCart.items || [];
      $scope.user = Auth.getCurrentUser().email;
      //returns all items from db schema,
      $scope.getItems = function() {
        return cartFactory.getItems($scope.user);
      };

      //add item to db
      $scope.addItem = function(item) {
        //$scope.items = cartFactory.addItem($scope.items, item, $scope.user);
        $scope.charge = (parseFloat($scope.charge) + parseFloat(item.price)).toFixed(2);
      };
      //remove item locally and from db
      $scope.removeItem = function(items, item) {
        $scope.charge = (parseFloat($scope.charge) - parseFloat(item.price)).toFixed(2);
        //$scope.items = cartFactory.removeItem($scope.items, item, $scope.user);

      };
      //scope.charge is rendered total price on screen
      //cartFactory.totalCharge calculates total price of items
      $scope.charge = cartFactory.totalCharge($scope.items);

      //clear items locally and drop schema
      $scope.dropSchema = function() {
        //$scope.items = [];
        $scope.charge = parseFloat(0).toFixed(2);
        cartFactory.dropSchema($scope.user);
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
      }

    }
  ])

  .factory('cartFactory', ['$http',
    function($http) {
      // console.log(Auth.getCurrentUser(), "CURRENTUSER")

      var cart = {};

      //add item to db
      cart.addItem = function(items, item, user) {

        //push item into local item array
        items.push(item);

        //if it's the first item create a row
        if (items.length === 1) {
          $http.put('/api/carts/name/' + user, items)
            .success(function(data) {
              console.log('successful res  from client create', data)

            })
            .error(function(err) {
              console.log("ERROR from client Create: ", err)
            })
        } else {
          //if  not the first item update  the row
          console.log(items, "ITEMS IN CLIENT UPDATE")
          $http.post('/api/carts/name/' + user, items)
            .success(function(data) {
              console.log('successful res  from client', data)

            })
            .error(function(err) {
              console.log("ERROR: ", err)
            })
        }
        return items
      };

      //removes item locally and from db
      cart.removeItem = function(items, item, user) {
        //remove item from items locally
        items.splice(items.indexOf(item), 1);

        //add to db
        $http.post('/api/carts/name/' + user, items)
          .success(function(data) {
            console.log('successful res from client', data)

          })
          .error(function(err) {
            console.log("ERROR REMOVING ITEM: ", err)
          });

        console.log(items);
        return items;
      };
      //calculate price of items in local cart
      cart.totalCharge = function(items) {
        var totalCharge = 0;
        for (var i = 0; i < items.length; i++) {
          totalCharge = totalCharge + parseFloat(items[i].price);
        }

        return totalCharge.toFixed(2);
      };

      cart.getItems = function(user) {
        $http.get('/api/carts/name/' + user)
          .success(function(data) {
            console.log(data);
            return data
          })
          .error(function(err) {
            console.log("ERROR: ", err);
          })

      };
      //clear items for user locally and in db
      cart.dropSchema = function(user) {
        $http.delete('/api/carts/name/' + user)
          .success(function(msg) {
            console.log('Success dropping Schema: ', msg);
          })
          .error(function(err) {
            console.log('Error: ', err);
          })
      };
      //return the CartFactory object
      return cart;
    }
  ]);
