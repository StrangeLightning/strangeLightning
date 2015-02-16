'use strict';

angular.module('thesisApp')
  .controller('CartCtrl', ['$scope', 'cartFactory', function ($scope, cartFactory) {
    var food = {'name':'food', 'price':'20.00'};
    var Kevin = {'name': 'Kevin', 'price':'10.00'}
    var PraneysPalace = {'name':'P', 'price' :'50.00'}
    $scope.items = [food, Kevin, PraneysPalace];
 	$scope.getItems = function(){
 		cartFactory.getItems();
 	}
 	//
 	$scope.addItem = function(item){
 		cartFactory.addItem({'name':'asdf', 'price' :'50.00'})
  	}
  	$scope.removeItem =function(items, item){
		console.log('logging')
		cartFactory.removeItem($scope.items, item);
  		$scope.totalCharge = $scope.totalCharge - item.price;
  	}
  	$scope.totalCharge = cartFactory.totalCharge($scope.items)
  	$scope.dropSchema = cartFactory.dropSchema;
  }]).
factory('cartFactory', ['$http', function($http){
	var cart = {};
	cart.addItem = function(item, items){
		// items.push(item)
		$http.post('/api/carts', item)
			.success(function(data){

			})
			.error(function(err){
				console.log("ERROR: ", err)
			})
		console.log('successful add')	
	}
	cart.removeItem = function(items, item, totalCharge){
		items.splice(items.indexOf(item), 1)	
		totalCharge = totalCharge - item.price
		$http
	}
	cart.totalCharge = function(items){
		var totalCharge = 0;
		for (var i = 0;i < items.length;i++){
			// console.log(items[i])
			totalCharge = totalCharge + parseInt(items[i].price);
			console.log(totalCharge)
		}
		return totalCharge;
	}
	cart.getItems = function(){
		$http.get('/api/carts')
			.success(function(data){
				console.log(data)
			})
			.error(function(err){
				console.log("ERROR: ", err)
			})
	}
	cart.dropSchema = function(){
		$http.delete('/api/carts')
			.success(function(msg){
				console.log('Success dropping Schema: ', msg)
			})
			.error(function(err){
				console.log('Error: ', err)
			})
	}
	return cart;
}])

