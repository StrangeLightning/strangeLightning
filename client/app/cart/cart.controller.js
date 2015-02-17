'use strict';

angular.module('thesisApp')
  .controller('CartCtrl', ['$scope', 'cartFactory', 'Auth', function($scope, cartFactory) {
    // var food = {'name':'food', 'price':'10.20'};
    // var Kevin = {'name': 'Kevin', 'price':'10.30'}
    // var PraneysPalace = {'name':'P', 'price' :'50.00'}
    // $scope.items = [food, Kevin, PraneysPalace]; 

    //where local items are stored
    $scope.items = [];

    //get all items from db schema
    $scope.getItems = function() {
      cartFactory.getItems();
    }

    //add item to db
    $scope.addItem = function(item) {
        $scope.items = cartFactory.addItem($scope.items, item)
        $scope.charge = (parseFloat($scope.charge) + parseFloat(item.price)).toFixed(2)
      }
      //remove item locally and from db
    $scope.removeItem = function(items, item) {
        $scope.charge = (parseFloat($scope.charge) - parseFloat(item.price)).toFixed(2)
        $scope.items = cartFactory.removeItem($scope.items, item);

      }
      //calculate total price of items
    $scope.charge = cartFactory.totalCharge($scope.items)

    //clear items locally and drop schema
    $scope.dropSchema = function() {
      $scope.items = [];
      $scope.charge = parseFloat(0).toFixed(2)
      cartFactory.dropSchema();
    }
  }]).
factory('cartFactory', ['$http', 'Auth', function($http, Auth) {

      var cart = {};
      cart.addItem = function(items, item) {
        console.log(Auth.getCurrentUser();
          //adds item to local $item.list
          items.push(item)

          //
          // $http.patch('/api/carts/name/greatScott', items)
          //  .success(function(data){
          //      console.log('successful res  from client', data)    

          //  })
          //  .error(function(err){
          //      console.log("ERROR: ", err)
          //  })
          return items
        }
        cart.removeItem = function(items, item, totalCharge) {
            items.splice(items.indexOf(item), 1)

            console.log(items)
              // $http.patch('userName')
              // totalCharge = totalCharge - item.price
            return items;
          }
          //calculate price of items in local cart
        cart.totalCharge = function(items) {
          var totalCharge = 0;
          for (var i = 0; i < items.length; i++) {
            totalCharge = totalCharge + parseFloat(items[i].price);
          }

          return totalCharge.toFixed(2)
        }

        cart.getItems = function() {
            $http.get('/api/carts/name/greatScott')
              .success(function(data) {
                console.log(data)
              })
              .error(function(err) {
                console.log("ERROR: ", err)
              })
          }
          //clear local items 
        cart.dropSchema = function() {
          $http.delete('/api/carts/name/test')
            .success(function(msg) {
              console.log('Success dropping Schema: ', msg)
            })
            .error(function(err) {
              console.log('Error: ', err)
            })
        }
        return cart;
      }])