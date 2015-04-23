(function (window, angular) {
    "use strict";

    /**
     * @ngdoc overview
     * @name wc.login.controller
     *
     * @description
     * Controller for the login form.
     *
     */
    angular.module('wc.login.controller', [])
        .controller('WcLoginController', [
            '$scope',
            '$location',
            '$state',
            'authService',
            'wcConfig',
            function ($scope, $location, $state, authService, wcConfig) {
                // model bound to form input:
                $scope.loginform = {};

                /**
                 * Log In.
                 * Called when log in form is submitted.
                 */
                $scope.logIn = function() {
                    authService.login($scope.loginform.email, $scope.loginform.password)
                    .then(function(result) {
                        // forward to Dashboard
                        $state.go('dashboard');
                    }, function(message) {
                        console.log(message);
                    });
                };


            }]);

})(window, window.angular);