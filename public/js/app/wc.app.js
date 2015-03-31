(function(window, angular) {
    "use strict";

    angular.module('wc', [
        // lib
        'ui.bootstrap',
        'ui.router',

        // wc
        'wc.templates',
        'wc.config',
        'wc.navbar',
        'wc.dashboard',
        'wc.duecontacts',
        'wc.reminders',
        'wc.auth'
    ])
    .config([
        'wcConfig',
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function(wcConfig, $stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.when('', '/dashboard');
            $urlRouterProvider.when('/', '/dashboard');
            $urlRouterProvider.otherwise('/dashboard');

            $locationProvider.hashPrefix('!').html5Mode(true);

            $stateProvider
                .state('dashboard', {
                    url: '/dashboard',
                    views: {
                        "content@" : {
                            templateUrl: 'dashboard.html',
                            controller: 'WcDashboardController'
                        },
                        "header@" : {
                            templateUrl: 'navbar.html',
                            controller: 'WcNavbarController'
                        }
                    }
                });
 

        }
    ])
    .run([
        'wcConfig',
        function(wcConfig) {
            //add any route intercepts here


        }
    ]);
})(window, window.angular);
