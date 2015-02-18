angular.module('thesisApp')
  .factory('cartFactory', ['$http', 'Auth', function($http, Auth) {
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

    ////AMAZON CART FUNCTIONALITY

    cart.amazonGetCart = function() {
      console.log(cart.amazonCart)
      $http.post('/api/amazoncarts/get', {
          'cartId': cart.amazonCart['CartId'][0],
          'HMAC': cart.amazonCart['HMAC'][0]
        })
        .success(function(data) {
          console.log('cart from AMAZON:  ', data);

        })
        .error(function(err) {
          console.log("ERROR getting Cart ", err);
        });
    }
    cart.amazonAddProduct = function(itemId, product, cartId, HMAC, newQuantity) {
      $http.post('/api/amazoncarts/modify', {
          'id': itemId,
          'productId': product
        })
        .success(function(data) {
          console.log('successful res from AMAZON client', data)

        })
        .error(function(err) {
          console.log("ERROR creating Cart ", err)
        });

    }
    cart.amazonCreateCart = function(itemId) {
      // console.log(Auth.getCurrentUser().id)

      $http.post('/api/amazoncarts/create', {
          'id': itemId
        })
        .success(function(data) {
          console.log('successful res from AMAZON client', data)
          cart.amazonCart = data;
        })
        .error(function(err) {
          console.log("ERROR creating Cart ", err)
        });
    }

    return cart;
  }]);