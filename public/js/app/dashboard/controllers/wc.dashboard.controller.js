(function (window, angular) {
    "use strict";

    /**
     * @ngdoc overview
     * @name wc.dashboard.controller
     *
     * @description
     * Controller for the client dashboard (main page).
     *
     */
    angular.module('wc.dashboard.controller', [])
        .controller('WcDashboardController', [
            '$scope',
            '$location',
            '$state',
            'authService',
            'wcConfig',
            function ($scope, $location, $state, authService, wcConfig) {
                // Authentication
                if (authService.isLoggedIn() === false) {
                    $state.go('login', { location: false }); // go to login
                    throw new Error(wcConfig.errorMessages.notAuthorized);
                }

                console.log('logged in');

            }]);

})(window, window.angular);
