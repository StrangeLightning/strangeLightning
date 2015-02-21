'use strict';

describe('Directive: saKeyPressEvents', function () {

  // load the directive's module and view
  beforeEach(module('thesisApp'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sa-key-press-events></sa-key-press-events>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element).toBeDefined();
  }));
});
