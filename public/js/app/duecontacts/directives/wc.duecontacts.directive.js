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
                        contactsService.loadContacts()
                            .then(function(result) {
                                // store reference to list of groups in the scope
                                scope.groups = result.groups;

                                // for each group, build a list of due contacts
                                scope.dueContacts = {};
                                angular.forEach(scope.groups, function(group, groupId) {
                                    scope.dueContacts[groupId] = contactsService.getDueContacts(groupId);
                                });
                            })
                            .then(null, function(err) {
                                usermessageService.growlError(err);
                            });


                    }
                };
            }
        ]);

})(window, angular);