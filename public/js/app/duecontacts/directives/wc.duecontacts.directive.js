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
            'contactsService',
            'usermessageService',
            function(contactsService, usermessageService) {
                return {
                    restrict: 'E',
                    templateUrl: 'duecontacts.html',
                    scope: {},
                    replace: true,
                    link: function(scope) {
                        // refresh contacts,groups from server
                        contactsService.load()
                            .then(function() {
                                // get a list of due contacts, ordered by group
                                scope.dueContacts = contactsService.dueContacts();
                            })
                            .then(null, function(err) {
                                usermessageService.growlError(err);
                            });

                    }
                };
            }
        ]);

})(window, angular);