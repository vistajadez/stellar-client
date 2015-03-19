(function (window, angular) {
    "use strict";

    /**
     * @ngdoc overview
     * @name wc.navbar.controller
     *
     * @description
     * Controller for the client nav bar.
     *
     */
    angular.module('wc.navbar.controller', [])
        .controller('WcNavbarController', [
            '$scope',
            '$location',
            '$state',
            '$stateParams',
            function ($scope, $location, $state, $stateParams) {
                $scope.navbarCollapsed = true;

            }]);

})(window, window.angular);
