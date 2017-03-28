(function () {
  'use strict';

  angular.module('quoty')
    .config(AppConfig);

  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function AppConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/homepage');

    $stateProvider.state('root', {
      abstract: true,
      views: {
        root: {
          template: '<div ui-view="nav"></div>' +
          '<div ui-view></div>'
        },
        'nav@root': {
          templateUrl: 'app/nav/nav.template.html'
        }
      }
    });

    $stateProvider.state('root.homepage', {
      url: '/homepage',
      templateUrl: 'app/homepage/homepage.html',
      controller: 'HomepageController',
      controllerAs: 'homeCtrl',
      resolve: {
        quotes: ['quotesService', function (quotesService) {
          return quotesService.getQuotes();
        }]
      }
    });

    $stateProvider.state('root.quoteDetails', {
      url: '/quote-details/:id',
      templateUrl: 'app/quote-details/quote.details.html',
      controller: 'QuoteDetailsController',
      controllerAs: 'qdCtrl',
      params: {
        id: null,
        gradientClass: null
      },
      resolve: {
        quote: ['$stateParams', 'quotesService', function ($stateParams, quotesService) {
          return quotesService.getFilteredQuotes({id: $stateParams.id})
            .then(function (data) {
              return data ? data[0] : {};
            }, function (e) {
              console.error(e);
              return {};
            });
        }]
      }
    });

    $stateProvider.state('root.randomQuote', {
      resolve: {
        dummy: ['$state', 'quotesService', function ($state, quotesService) {
          return quotesService.getRandomQuote()
            .then(function (randomQuote) {
              return $state.go('root.quoteDetails', {id: randomQuote.id});
            });
        }]
      }
    });
  }
})();
