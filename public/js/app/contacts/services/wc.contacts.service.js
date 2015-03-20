(function (window, angular) {
    "use strict";

    /**
     * @ngdoc service
     * @name contactsService
     *
     * @description
     * Provides all inter-app contact persistence functionality.
     *
     */
    angular.module('wc.contacts.service', [])
        .factory('contactsService', [
            function contactsServiceFactory() {
                return {
                    getContacts: function() {

                    }



                };

            }
        ]);


})(window, window.angular);