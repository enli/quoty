(function () {
  'use strict';

  angular.module('quoty.shared.components')
    .component('quoteCard', {
      templateUrl: 'app/shared/components/quote-card/quote.card.template.html',
      controller: 'QuoteCardController',
      controllerAs: 'qcCtrl',
      bindings: {
        quote: '<quoteCardQuote',
        gradientClass: '<?quoteCardGradientClass',
        isBigCard: '@?quoteCardIsBigCard'
      }
    });

})();
