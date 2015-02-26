'use strict';

describe('Service: facet', function () {

  // load the service's module
  beforeEach(module('thesisApp'));

  // instantiate service
  var facet;
  beforeEach(inject(function (_facet_) {
    facet = _facet_;
  }));

  it('should do something', function () {
    expect(!!facet).toBe(true);
  });

});
