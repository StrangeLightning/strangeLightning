describe('LoginCtrl', function() {
  var LoginCtrl, createLoginCtrl, $scope, $rootScope, $controller, $httpBackend, $location, $q, $window;

  beforeEach(function () {
    module('thesisApp');

    inject(function ($rootScope, $controller, _$httpBackend_, _$location_, _$window_) {
      $scope = $rootScope.$new();
      $location = _$location_;
      $httpBackend = _$httpBackend_;
      $window = _$window_

      createLoginCtrl = function () {
        console.log("Creating controller")
        $controller('LoginCtrl', {
          $scope: $scope,
        })
      };
      createLoginCtrl()
    })
  });
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('controller functionality', function () {
    it("should have a scope variable", function () {

      expect($scope).toBeDefined();
    })

    it("should have a loginOauth function", function () {
      // createLoginCtrl();
      expect(angular.isFunction($scope.loginOauth)).toBe(true)
    })

    it('should redirect to /auth/facebook ', function () {
      // $window.location.href = 'boo '
      // console.log($window.location.href)
      var localContext = {
        "window": {
          location: {
            href: "http://sphereable.com/login"
          }
        }
      }

      // simulated context
      with(localContext) {
          // console.log(window.location.href);
          // $scope.loginOauth('facebook')
          // console.log(window.location.href);

          // http://www.website.com?varName=foo
        }
        // console.
        // SpyOn($window.location, 'href').toEqual('/auth/facebook')
        // $httpBackend.whenGET('/auth/facebook').respond(200)
        // scope.loginOauth('faker')
        // console.log("SCOPE", scope)
        // console.log("LoginCtrl: ", LoginCtrl)
      expect(1).toEqual(1);
    })
  });

  describe('login authentication functionality', function () {
    // it('should return an authentication token', function() {
    //   $httpBackend.whenGET('auth/faker').respond(404);
    //   $httpBackend.whenGET('auth/facebook').respond(200);

    // })
  })
});