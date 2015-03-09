angular.module('thesisApp')
  .factory('cartFactory', ['$http', 'localStorageService', '$rootScope', function($http, localStorageService, $rootScope) {
    var cart = {};
    cart.amazonCart = {};
    //all local storage of amazonItems will be on this object.
    //due to the throttle limit on the Amazon Product API (40 calls/minute)
    //and the cronjobs running from the product server this is neccesisary

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

      return items;
    };
    //calculate price of items in local cart
    cart.totalCharge = function(items) {
      var totalCharge = 0;
      items = items || [];
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

    ////AMAZON CART FUNCTIONALITY

    cart.amazonGetCart = function(callback) {

      $http.post('/api/amazoncarts/get', {})
        .success(function(data) {
          callback(data);
        })
        .error(function(err) {
          console.log("ERROR getting Cart ", err);
          callback(data);
        });
    };

    cart.amazonRemoveProduct = function(product, amazonCart) {
      var newquantity;
      //look for the product id of being updated item in the cart
      for (var i = 0; i < cart.amazonCart.items.length; i++) {
        if (product === cart.amazonCart.items[i]['productId']) {
          //save new desired value to be set to by the
          newquantity = cart.amazonCart.items[i]['quantity'] - 1;
          //save the place in the cart to follow DRY pattern
          var currentItem = i;
          break;
        }
      }
      //call to the API to removes 1 quantity of the item
      return $http.post('/api/amazoncarts/modify', {
          'id': product,
          'productId': product,
          'CartId': cart.amazonCart['CartId'],
          'HMAC': cart.amazonCart['HMAC'],
          'Quantity': newquantity
        })
        .success(function(data) {
          //success indicates a call to the API had no error,
          //WARNING: success only means that a call was made
          //due to the limit of API calls/minute it might
          //not update the cart so we run the check
          if (data['Quantity'] === undefined) {
            //should be clearing cart
            cart.amazonClearCart()
          } else if (data['Quantity'] < cart.amazonCart['Qty']) {
            if (newquantity === 0) {
              //remove item from local cart
              cart.amazonCart.items.splice(currentItem, 1)
            } else {
              cart.amazonCart.items[currentItem]['quantity'] --;
            }
            cart.amazonCart['Qty'] = data['Quantity'];
            cart.saveLocally(cart.amazonCart);

            //update local quantity
          }

        })
        .error(function(err) {
          console.log("ERROR creating Cart ", err)
        });

    };

    cart.amazonAddProduct = function(product, amazonCart) {
      var newquantity;
      cart.amazonCart = cart.amazonCart
        // cart.amazonCart.items = cart.amazonCart.items;
        //look for the product id of being updated item in the cart
      for (var i = 0; i < cart.amazonCart.items.length; i++) {
        if (product === cart.amazonCart.items[i]['productId']) {
          //add one to the quantity of that item
          newquantity = cart.amazonCart.items[i]['quantity'] + 1;
          //save the place in the cart to follow DRY pattern
          var currentItem = i;
          //if the item was already there set flag to updated
          var updated = true
          break;
        }
      }
      //if it is a brand new item push it into the cart

      //call to the API to add 1 quantity of the item
      $http.post('/api/amazoncarts/modify', {
          'id': product,
          'productId': product,
          'CartId': cart.amazonCart['CartId'],
          'HMAC': cart.amazonCart['HMAC'],
          'Quantity': newquantity || 1
        })
        .success(function(data) {
          //success indicates a call to the API had no error,
          //WARNING: success only means that a call was made
          //due to the limit of API calls/minute it might
          //not update the cart so we run the check

          if (data['Quantity'] > cart.amazonCart['Qty']) {
            if (updated === true) {
              cart.amazonCart.items[currentItem].quantity++;
            } else {
              cart.amazonCart.items.push({
                "productId": product,
                "quantity": 1
              })
            }
            cart.amazonCart['Qty'] = data['Quantity'];
            //update local quantity
            cart.saveLocally(cart.amazonCart);
          }
        })
        .error(function(err) {

          console.log("ERROR adding data Cart ", err)
        });

    };

    cart.amazonCreateCart = function(itemId) {
      $http.post('/api/amazoncarts/create', {
          'id': itemId
        })
        .success(function(data) {
          cart.amazonCart = {
            "CartId": data.CartId[0],
            "HMAC": data.HMAC[0],
            "items": [],
            "Qty": 1
          };

          cart.amazonCart.items.push({
            "productId": data.CartItems[0].CartItem[0].ASIN[0],
            "quantity": 1
          });
          cart.saveLocally(cart.amazonCart)

        })
        .error(function(err) {
      console.log("ERROR creating Cart ", err)
        });
    };

    cart.amazonClearCart = function() {
      $http.post('/api/amazoncarts/clear', {})
        .success(function(data) {
          cart.amazonCart = {};
          cart.saveLocally(cart.amazonCart)
        })
        .error(function(err) {
          console.log("ERROR creating Cart ", err)
        });
    };
    cart.saveLocally = function(Cart) {
      localStorageService.set('Cart', Cart)
      $rootScope.$broadcast('changeCartQuantity')
    };
    return cart;
  }]);