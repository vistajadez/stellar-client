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
            'usermessageService',
            'usSpinnerService',
            function ($scope, $location, $state, authService, usermessageService, usSpinnerService) {
                // model bound to form input:
                $scope.loginform = {};

                /**
                 * Log In.
                 * Called when log in form is submitted.
                 */
                $scope.logIn = function() {
                    usSpinnerService.spin('loginSubmit');

                    authService.login($scope.loginform.email, $scope.loginform.password)
                    .then(function(result) {
                        usSpinnerService.stop('loginSubmit');

                        // forward to Dashboard
                        $state.go('dashboard');
                    }, function(message) {
                        usSpinnerService.stop('loginSubmit');
                        usermessageService.growlError(message);
                    });
                };


            }]);

})(window, window.angular);