'use strict';

describe('Controller: CartCtrl', function() {

  // load the controller's module
  beforeEach(module('thesisApp'));

  var CartCtrl, scope;

  // Initialize the controller and a mock scope
  // beforeEach(inject(function($controller, $rootScope) {
  //   scope = $rootScope.$new();
  //   CartCtrl = $controller('CartCtrl', {
  //     $scope: scope
  //   });
  // }));

  // it('should be able to add items locally', function() {
  //   scope.addItem({
  //     'user': 'geeered',
  //     'items': {
  //       'name': 'coke ',
  //       'price ': '70.00'
  //     }
  //   })
  //   expect(scope.items.length).toEqual(1)
  // })
  // it('should be able to add multiple items locally', function() {
  //   scope.addItem({
  //     'user': 'ed',
  //     'items': {
  //       'name': 'coddde ',
  //       'price ': '700.00'
  //     }
  //   })
  //   scope.addItem({
  //     'user': 'geeered',
  //     'items': {
  //       'name': 'coke ',
  //       'price ': '70.00'
  //     }
  //   })
  //   expect(scope.items.length).toEqual(2)
  // })
});