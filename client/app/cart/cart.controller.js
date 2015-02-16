'use strict';

angular.module('thesisApp')
  .controller('CartCtrl', ['$scope', 'cartFactory', function ($scope, cartFactory) {
    var food = {'name':'food', 'price':'20.00'};
    var Kevin = {'name': 'Kevin', 'price':'10.00'}
    var PraneysPalace = {'name':'P', 'price' :'50.00'}
    $scope.items = [food, Kevin, PraneysPalace];
 	$scope.addItem = function(item){
 		cartFactory.addItem({'name':'asdf', 'price' :'50.00'})
  	}
  	$scope.removeItem =function(items, item){
		console.log('logging')
		cartFactory.removeItem($scope.items, item);
  		$scope.totalCharge = $scope.totalCharge - item.price;
  	}
  	$scope.totalCharge = cartFactory.totalCharge($scope.items)
  }]).
factory('cartFactory', ['$http', function($http){
	var cart = {};
	cart.addItem = function(item, items){
		items.push(item)
		$http.post('/api/server/cart', $scope.item)
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
	cart.changeTotalCharge
	return cart;
}])
