describe('CartCtrl', function() {
  var CartCtrl, createCartCtrl, cartFactory, $scope, $rootScope, $controller, $httpBackend;

  beforeEach(function() {
    module('thesisApp');

    inject(function($rootScope, $controller, _$httpBackend_, cartFactory) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      cartFactory = cartFactory
        // $localStorageService = _$localStorageService_;
      createCartCtrl = function() {
        $controller('CartCtrl', {
          $scope: $scope,
        })
      };
      createCartCtrl()

    })
    $httpBackend.whenPOST('/api/amazoncarts/get').respond('200')
  });
  afterEach(function() {
    $httpBackend.whenPOST('/api/amazoncarts/get').respond('200')
    $httpBackend.whenGET('app/explore/explore.html').respond('301')
    $httpBackend.flush()
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('controller functions in place', function() {
    it("should have a scope variable", function() {

      expect($scope).toBeDefined();
    });

    it("should have a getItems function function", function() {
      expect($scope.getItems).toBeDefined();
    });

    it('should have a removeFromCart function ', function() {
      // with(localContext) {}
      expect($scope.removeFromCart).toBeDefined();
    })
    it('should have ')
  });
  describe('login authentication functionality', function() {})
});