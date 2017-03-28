(function () {
  'use strict';

  angular.module('quoty', [
    'ui.router',
    'wu.masonry',

    'quoty.homepage',
    'quoty.quote-details',
    'quoty.shared'
  ]);
})();
