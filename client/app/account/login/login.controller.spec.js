// 'use strict';

// describe('Login: Login Controller', function() {
//   var LoginCtrl, createController, user, $scope, $rootScope, $controller, $form, $httpBackend, $q;

//   // Load the controller's module
//   beforeEach(module('thesisApp'));


//   // Initialize the controller and a mock scope
//   beforeEach(inject(function($injector) {
//     $rootScope = $injector.get('$rootScope');
//     $controller = $injector.get('$controller');
//     $httpBackend = $injector.get('$httpBackend')
//     $q = $injector.get('$q')
//     defered = $q.defered;
//     // Login = injector.get('Login')
//     $scope = $rootScope.$new();
//     createController = function() {
//       LoginCtrl = $controller('LoginCtrl', {
//         $scope: $scope
//       });
//     };
//     createController();
//   }));
//   afterEach(function() {
//     $httpBackend.verifyNoOutstandingExpectation();
//     $httpBackend.verifyNoOutstandingRequest();
//   });

//   // TODO Once server auth processes are complete, this should create the test user.
//   // TODO most subsequent tests depend on successful server communication.
//   // Auth.createUser(user);
//   // user = {
//   //   email: 'test@test.com',
//   //   password: 'test',
//   //   accountType: 'client'
//   // };

//   // Create controller for testing

//   //   it('should fetch authentication token', function() {
//   //     console.log($scope.loginOauth)
//   //     $scope.loginOauth('faker')
//   //     $httpBackend.whenGET('auth/faker').respond(404);
//   //     $httpBackend.whenGET('auth/facebook').respond(200);
//   //     // expect($scope.loginOauth('faker')).toEqual(undefined);
//   //   });
//   // })