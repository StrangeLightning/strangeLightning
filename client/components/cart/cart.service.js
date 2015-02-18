'use strict';

angular.module('thesisApp')
  .factory('Cart', function ($q, $https) {
    return {

      create: function (productId) {
        var defer = $q.defer();
        $https({
          method: 'POST',
          url: '/api/carts/create/' + productId
        })
        .success(function (cart) {
          defer.resolve(cart);
        })
        .error(function () {
          defer.reject();
        });

        return defer.promise;
      },

      read: function (cartId) {
        var defer = $q.defer();
        $https({
          method: 'GET',
          url: '/api/carts/' + cartId
        })
        .success(function (cart) {
          defer.resolve(cart);
        })
        .error(function () {
          defer.reject();
        });

        return defer.promise;
      },

      add: function (productId) {
        var defer = $q.defer();
        $https({
          method: 'PUT',
          url: '/api/carts/add/' + productId
        })
        .success(function () {
          defer.resolve(true);
        })
        .error(function () {
          defer.resolve(false);
        });

        return defer.promise;
      },

      remove: function (productId) {
        var defer = $q.defer();
        $https({
          method: 'POST',
          url: '/api/carts/remove/' + productId
        })
        .success(function () {
          defer.resolve(true);
        })
        .error(function () {
          defer.resolve(false);
        });

        return defer.promise;
      },

      delete: function (cartId) {
        var defer = $q.defer();
        $https({
          method: 'DELETE',
          url: '/api/carts/' + cartId + '/clear'
        })
        .success(function () {
          defer.resolve(true);
        })
        .error(function () {
          defer.resolve(false);
        });

        return defer.promise;
      }

    };
  });
