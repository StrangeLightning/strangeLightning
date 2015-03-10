angular.module('thesisApp')
  .directive('showcaseCart', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/cart/cart.html',
      controller: 'CartCtrl',
      link: function (scope) {
        // hide the showcase by default
        $('.cart-container').css('margin-right', '-1000px');

        scope.$on('showcaseCart', function (event, cart) {
          // refech any new items added to the cart
          scope.getItems();

          if (!scope.pastCart) {
            scope.pastCart = true;

            $('.cart-container').animate({
              'height': screen.height,
              'margin-right': '+=1000px'
            }, 500);

            $('#catalog-photos').css({
              'opacity': '0.1'
            });
          }
        });

        scope.closeCart = function () {
          scope.pastCart = false;
          $('.cart-container').animate({
            'margin-right': '-=1000px'
          }, 500);

          $('#catalog-photos').css({
            'opacity': '1'
          });
        }
      }
    }
  });
