(function () {
  'use strict';

  angular.module('quoty.shared.services')
    .factory('quotesService', QuotesService);

  QuotesService.$inject = ['$http', '$q'];

  function QuotesService($http, $q) {
    var ALL_QUOTES_URL = 'app/config/quotes.json';
    var cachedQuotes = null;
    var gradientCounter = 0;
    var TOTAL_GRADIENTS = 13;

    var service = {
      getQuotes: getQuotes,
      getRandomQuote: getRandomQuote,
      getFilteredQuotes: getFilteredQuotes,
      getGradientClass: getGradientClass
    };

    return service;

    function getQuotes() {
      var defer = $q.defer();

      if (cachedQuotes) {
        defer.resolve(cachedQuotes);
      } else {
        $http.get(ALL_QUOTES_URL)
          .then(function (data) {
            cachedQuotes = data.data;
            defer.resolve(data.data);
          })
          .catch(function (e) {
            defer.reject(e);
          });
      }

      return defer.promise;
    }

    function getRandomQuote() {
      return getQuotes()
        .then(function (quotes) {
          return quotes[getRandomUpto(quotes.length)];
        })
        .catch(function (e) {
          // TODO: better handling
          return [];
        });
    }

    function getRandomUpto(n) {
      return Math.floor(Math.random() * n);
    }

    function getFilteredQuotes(criteria) {
      return getQuotes()
        .then(function (quotes) {
          return _.filter(quotes, criteria);
        })
        .catch(function (e) {
          // ignore
          return [];
        });
    }

    function getGradientClass() {
      if (gradientCounter > TOTAL_GRADIENTS) {
        gradientCounter = 0;
      }

      return 'gradient' + (gradientCounter++);
    }
  }
})();
