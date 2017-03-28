(function () {
  'use strict';

  angular.module('quoty.shared.components')
    .controller('QuoteCardController', QuoteCardController);

  QuoteCardController.$inject = ['quotesService', '$timeout'];

  function QuoteCardController(quotesService, $timeout) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      if (!vm.gradientClass || !vm.gradientClass.length) {
        vm.gradientClass = quotesService.getGradientClass();
      }

      vm.isBigCard = vm.isBigCard === 'true';

      vm._quote = vm.quote;
      vm.id = vm._quote.id;
      vm.quote = vm._quote.quote;
      vm.author = vm._quote.author;
      vm.authorName = '- ' + vm._quote.author.name;
      vm.topics = vm._quote.topics.join(', ');
    }
  }
})();
