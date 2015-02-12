'use strict';

describe('Service: vendor', function () {

  // load the service's module
  beforeEach(module('thesisApp'));

  // instantiate service
  var vendor;
  beforeEach(inject(function (_vendor_) {
    vendor = _vendor_;
  }));

  it('should do something', function () {
    expect(!!vendor).toBe(true);
  });

});
