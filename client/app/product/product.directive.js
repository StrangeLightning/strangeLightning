angular.module('thesisApp')
  .directive('showcaseProduct', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/product/product.html',
      controller: function($rootScope, $scope, cartFactory){
        // Call add product method from cart factor, and broadcast addToCart message to listeners
        $scope.addToCart = function(product) {
          $rootScope.$broadcast('addToCart');
          if(cartFactory.amazonCart.items) {
            cartFactory.amazonAddProduct(product, cartFactory.amazonCart)
          } else {
            cartFactory.amazonCreateCart(product);
          }
        };
      },
      link: function (scope) {
        // hide the showcase by default
        $('.showcase-catalog').css('margin-right', '-1000px');

        scope.$on('showcaseProduct', function (event, product) {
          var pastProduct = scope.product;
          scope.product = product;
          if (!pastProduct) {
            $('.showcase-container').animate({
              'height': screen.height,
              'margin-right': '+=1000px'
            }, 500);
            $('.showcase-catalog').animate({
              'height': screen.height,
              'margin-right': '+=1000px'
            }, 500);
            $('#catalog-photos').css({
              'opacity': '0.1'
            });
          }
        });

        scope.close = function () {
          $('.showcase-container').animate({
            'margin-right': '-=1000px'
          }, 500);
          $('.showcase-catalog').animate({
            'margin-right': '-=1000px'
          }, 500);
          $('#catalog-photos').css({
            'opacity': '1'
          });

          scope.product = null;
        }
      }
    }
  });
