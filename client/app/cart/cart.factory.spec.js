describe('CartFactory', function() {
  var factory, items, $injector, $q, $scope, $rootScope, $http, $httpBackend, localStorageService;

  beforeEach(function() {
    module('thesisApp');
    inject(function($rootScope, _$httpBackend_, _localStorageService_, cartFactory, $q) {
      factory = cartFactory;
      $httpBackend = _$httpBackend_;
      localStorageService = _localStorageService_;
    })
    data = {
      'CartId': [1],
      'HMAC': [555],
      'CartItems': [{
        'CartItem': [{
          'ASIN': [11111]
        }]
      }],
      'Quantity': 1
    };
    $httpBackend.whenPOST("/api/amazoncarts/create").respond(data);
    $httpBackend.whenPOST("/api/amazoncarts/clear").respond({});
  });
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('factory', function() {
    it("should be defined", function() {
      expect(factory).toBeDefined();
    });
  })
  describe('amazonCreateCart', function() {
    it('should have a amazonCreateCart function ', function() {
      expect(factory.amazonCreateCart).toBeDefined();
    });
    it('should should send req to api/amazoncart/create', function() {
      factory.amazonCreateCart(11111)
      $httpBackend.flush()
      expect(factory.amazonCart.items.length).toEqual(1);
      expect(factory.amazonCart['Qty']).toEqual(1)
    })
  })
  describe('amazonAddProduct', function() {
    it('should have amazonAddProduct function', function() {
      expect(factory.amazonAddProduct).toBeDefined()
    })
    it('should have amazonAddProduct add existing product', function() {
      data = {
        'CartId': [1],
        'HMAC': [555],
        'CartItems': [{
          'CartItem': [{
            'ASIN': [11111],
            'quantity': 1
          }]
        }],
        'Quantity': 1
      };
      //modify have multiple functions for the call so we mock the data munipulation
      $httpBackend.whenPOST("/api/amazoncarts/modify").respond(data)
      factory.amazonCreateCart(11111);
      $httpBackend.flush()
      data.CartItems[0].CartItem[0].quantity++;
      data.Quantity++;
      factory.amazonAddProduct(11111, factory.amazonCart);
      $httpBackend.flush()
      expect(factory.amazonCart.items.length).toEqual(1)
      expect(factory.amazonCart['Qty']).toEqual(2)

    })
    it('should have amazonAddProduct add product to local cart if productId different as first product', function() {
      data = {
        'CartId': [1],
        'HMAC': [555],
        'CartItems': [{
          'CartItem': [{
            'ASIN': [11111],
            'quantity': 1
          }]
        }],
        'Quantity': 1
      };
      //modify have multiple functions for the call so we mock the data munipulation
      $httpBackend.whenPOST("/api/amazoncarts/modify").respond(data)
      factory.amazonCreateCart(11111);
      $httpBackend.flush()
      data.Quantity++;
      data = data.CartItems.push({
        'CartItem': [{
          'ASIN': [22222],
          'quantity': 1
        }]
      })
      factory.amazonAddProduct(22222, factory.amazonCart);
      $httpBackend.flush()
      expect(factory.amazonCart.items.length).toEqual(2)
      expect(factory.amazonCart['Qty']).toEqual(2)
    })
  })
  describe('amazonRemoveProduct', function() {
    it('should remove item if one item in cart post create', function() {
      factory.amazonCreateCart(11111)
      $httpBackend.flush();
      data = {
        'CartId': [1],
        'HMAC': [555],
        'CartItems': [{
          'CartItem': [{
            'ASIN': [11111],
            'quantity': 1
          }]
        }],
        'Quantity': 1
      };
      data.CartItems[0].CartItem[0].quantity--;
      data.CartItems.pop();
      data.Quantity = undefined;
      $httpBackend.whenPOST("/api/amazoncarts/modify").respond(data)
      factory.amazonRemoveProduct(11111);
      $httpBackend.flush();
      expect(factory.amazonCart).toEqual({})
    })
    it('should remove original item plus secondary item', function() {
      data = {
        'CartId': [1],
        'HMAC': [555],
        'CartItems': [{
          'CartItem': [{
            'ASIN': [11111],
            'quantity': 1
          }]
        }],
        'Quantity': 1
      };
      //modify have multiple functions for the call so we mock the data munipulation
      $httpBackend.whenPOST("/api/amazoncarts/modify").respond(data)
      factory.amazonCreateCart(11111);
      $httpBackend.flush();
      data.Quantity++;
      factory.amazonAddProduct(22222, factory.amazonCart);
      $httpBackend.flush();
      data.CartItems.pop();
      data.Quantity--;
      factory.amazonRemoveProduct(22222, factory.amazonCart);
      $httpBackend.flush();
      expect(factory.amazonCart.Qty).toEqual(1)
    })
  })
  describe('save locally and broadcast changes', function() {
    it('should have a function save locally', function() {
      expect(factory.saveLocally).toBeDefined()
    })
    it('should be triggered by changes to cart', function() {
      spyOn(factory, "saveLocally");
      factory.amazonCreateCart(11111);
      $httpBackend.flush();
      expect(factory.saveLocally).toHaveBeenCalled();
      factory.amazonClearCart();
      $httpBackend.flush();
      expect(factory.saveLocally).toHaveBeenCalled();
    })
  })
})