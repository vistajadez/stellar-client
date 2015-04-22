(function (window, angular) {
    "use strict";

    /**
     * @ngdoc directive
     * @name wcDuecontacts
     *
     * @scope
     * @description
     *
     * Display a list of contacts that are due to be contacted.
     * @example:
            <example>
                <wc-duecontacts></wc-duecontacts>
            </example>
     */
    angular.module('wc.duecontacts.directive', [])
        .directive('wcDuecontacts', [
            'authService',
            'contactsService',
            function(authService, contactsService) {
                return {
                    restrict: 'E',
                    templateUrl: 'duecontacts.html',
                    scope: {},
                    replace: true,
                    link: function(scope) {
                        scope.contacts = contactsService.getContacts();
                        console.log(scope.contacts);
                    }
                };
            }
        ]);

})(window, angular);