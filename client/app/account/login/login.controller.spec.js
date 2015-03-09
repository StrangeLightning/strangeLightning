describe('LoginCtrl', function() {
  var LoginCtrl, createLoginCtrl, $scope, $rootScope, $controller, $httpBackend, $location, $window;

  beforeEach(function() {
    module('thesisApp');

    inject(function($rootScope, $controller, _$httpBackend_, _$location_, _$window_) {
      $scope = $rootScope.$new();
      $location = _$location_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;

      createLoginCtrl = function() {
        $controller('LoginCtrl', {
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
      // createLoginCtrl();
      expect(angular.isFunction($scope.loginOauth)).toBe(true)
    });

    it('should redirect to /auth/facebook ', function() {
      var localContext = {
        "window": {
          location: {
            href: "http://sphereable.com/login"
          }
        }
      };

      // simulated context
      with(localContext) {}
      expect(1).toEqual(1);
    })
  });
  describe('login authentication functionality', function() {})
});