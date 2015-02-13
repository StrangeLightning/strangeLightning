'use strict';

describe('Controller: VendorCtrl', function () {
  var SettingsCtrl, createController, exampleClient, exampleWorker,
    $scope, $rootScope, $controller, $form, $q, $httpBackend;

  // Load the controller's module
  beforeEach(module('thesisApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');

    $form = $("<form />");
    $scope = $rootScope.$new();
    $scope.form = {$valid: true};

    exampleClient = {
      name: 'Test Client',
      location: 'Test, IS',
      email: 'test@test.com',
      password: 'test',
      account_type: 'Client'
    };

    exampleWorker = {
      name: 'Test Worker',
      location: 'Test, IS',
      email: 'test@test.com',
      password: 'test',
      account_type: 'Worker',
      skills: "I'm a lumberjack.",
      hourly_rate: '69',
      summary: "I'm okay. I sleep all night and I work all day."
    };

    // Create controller for testing
    createController = function() {
      SettingsCtrl = $controller('SettingsCtrl', {
        $scope: $scope
      });
    };

  }));

  it('should send post request to update worker profile', function () {
    var data;
    $scope.user = exampleWorker;
    // set up a deferred
    var deferred = $q.defer();
    // get promise reference
    var promise = deferred.promise;

    // check that http requests are getting handled correctly
    $httpBackend.whenGET('/api/config').respond(200);
    $httpBackend.whenGET('app/main/main.html').respond(200);
    $httpBackend.whenPOST('/api/user/getuser').respond(302);
    $httpBackend.whenPOST('/api/user/editprofile?accountType=Worker&email=test@test.com').respond(302);

    // set up promise resolve callback
    promise.then(function (response) {
      data = response;
    });

    createController();
    $scope.updateProfile($scope.form).then(function(){
      deferred.resolve($scope.message);
    });

    $httpBackend.flush();

    expect(data).toEqual('Error updating profile. Please try again later.');
  });

  it('should send post request to update client profile', function () {
    var data;
    $scope.user = exampleClient;
    // set up a deferred
    var deferred = $q.defer();
    // get promise reference
    var promise = deferred.promise;

    // check that http requests are getting handled correctly
    $httpBackend.whenGET('/api/config').respond(200);
    $httpBackend.whenGET('app/main/main.html').respond(200);
    $httpBackend.whenPOST('/api/user/getuser').respond(302);
    $httpBackend.whenPOST('/api/user/editprofile?accountType=Client&email=test@test.com').respond(302);

    // set up promise resolve callback
    promise.then(function (response) {
      data = response;
    });

    createController();
    $scope.updateProfile($scope.form).then(function(){
      deferred.resolve($scope.message);
    });

    $httpBackend.flush();

    expect(data).toEqual('Error updating profile. Please try again later.');
  });
});
