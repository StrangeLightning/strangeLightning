'use strict';

describe('Directive: saSetHeightDirective', function () {

  // load the directive's module
  beforeEach(module('thesisApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sa-set-height-directive></sa-set-height-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the saSetHeightDirective directive');
  }));
});