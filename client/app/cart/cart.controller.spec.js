describe('CartCtrl', function() {
  var CartCtrl, $scope, $rootScope, $controller, $httpBackend, $localStorageService;

  beforeEach(function() {
    module('thesisApp');

    inject(function($rootScope, $controller, _$httpBackend_, _$localStorageService_) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $localStorageService = _$localStorageService_;
      createCartCtrl = function() {
        $controller('CartCtrl', {
          $scope: $scope,
        })
      };
      createLoginCtrl()
    })
  });
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('controller functionality', function() {
    it("should have a scope variable", function() {

      expect($scope).toBeDefined();
    });

    it("should have a loginOauth function", function() {
      // expect(()).toBe()
    });

    it('should redirect to /auth/facebook ', function() {
      with(localContext) {}
      expect(1).toEqual(1);
    })
  });
  describe('login authentication functionality', function() {})
});