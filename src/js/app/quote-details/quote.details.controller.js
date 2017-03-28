(function () {
  'use strict';

  angular.module('quoty.quote-details')
    .controller('QuoteDetailsController', QuoteDetailsController);

  QuoteDetailsController.$inject = ['$stateParams', 'quote'];

  function QuoteDetailsController($stateParams, quote) {
    var vm = this;

    vm.gradientClass = $stateParams.gradientClass;
    vm.quote = quote;
    vm.author = quote.author;
    vm.topics = quote.topics.join(', ');
  }
})();
