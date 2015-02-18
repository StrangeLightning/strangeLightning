'use strict';

describe('Controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('thesisApp'));

  var AboutCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VendorCtrl = $controller('VendorCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
