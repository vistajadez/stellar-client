(function(window, angular) {
    "use strict";

    angular.module('wc', [
        // lib
        'ui.bootstrap',
        'ui.router',
        'angular-growl',
        'ngAnimate',
        'angularSpinner',

        // wc
        'wc.templates',
        'wc.config',
        'wc.navbar',
        'wc.dashboard',
        'wc.duecontacts',
        'wc.reminders',
        'wc.auth',
        'wc.contacts',
        'wc.groups',
        'wc.login',
        'wc.usermessage'
    ])
    .config([
        'wcConfig',
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        'growlProvider',
        function(wcConfig, $stateProvider, $urlRouterProvider, $locationProvider, growlProvider) {
            growlProvider.globalTimeToLive(5000);
            growlProvider.globalDisableCountDown(true);

            $urlRouterProvider.when('', '/dashboard');
            $urlRouterProvider.when('/', '/dashboard');
            $urlRouterProvider.otherwise('/dashboard');

            // Use HTML5 mode only if HTML5 History API is available (IE9 doesn't support)
            // http://stackoverflow.com/questions/22763599/ie-9-not-supporting-locationprovider-html5mode
            $locationProvider.hashPrefix('!').html5Mode(window.history && history.pushState ? true : false);

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
                })
                .state('login', {
                    url: '/login',
                    views: {
                        "content@" : {
                            templateUrl: 'login.html',
                            controller: 'WcLoginController'
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