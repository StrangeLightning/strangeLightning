'use strict';

var should = require('should');
var app = require('../../app');
var Buyer = require('./../buyer/buyer.model.js');

var buyer = new Buyer({
  provider: 'local',
  name: 'Fake Buyer',
  email: 'test@test.com',
  password: 'password'
});

describe('Buyer Model', function() {
  before(function(done) {
    // Clear buyers before testing
    Buyer.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Buyer.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no buyers', function(done) {
    Buyer.find({}, function(err, buyers) {
      buyers.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate buyer', function(done) {
    buyer.save(function() {
      var buyerDup = new Buyer(buyer);
      buyerDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    buyer.email = '';
    buyer.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate buyer if password is valid", function() {
    return buyer.authenticate('password').should.be.true;
  });

  it("should not authenticate buyer if password is invalid", function() {
    return buyer.authenticate('blah').should.not.be.true;
  });
});
