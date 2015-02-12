'use strict';

describe('Controller: ShowroomCtrl', function () {

  // load the controller's module
  beforeEach(module('thesisApp'));

  var ShowroomCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShowroomCtrl = $controller('ShowroomCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
