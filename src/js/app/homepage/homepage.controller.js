(function () {
  'use strict';

  angular.module('quoty.homepage')
    .controller('HomepageController', HomepageController);

  HomepageController.$inject = ['quotes'];

  function HomepageController(quotes) {
    var vm = this;

    vm.hello = 'hello2';
    vm.quotes = quotes;
  }
})();
