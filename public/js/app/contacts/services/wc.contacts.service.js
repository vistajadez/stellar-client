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
            'authService',
            '$http',
            'wcConfig',
            function contactsServiceFactory(authService, $http, wcConfig) {
                var contacts = {};
                var lastPullTimestamp = ''; // every time we pull from server, we'll set this

                return {
                    /**
                     * Get Contacts.
                     *
                     */
                    getContacts: function() {
                        var userInfo;
                        var url;

                        if (!authService.isLoggedIn()) {
                            throw new Error(wcConfig.errorMessages.notAuthorized);
                        }

                        // refresh from server since last pull
                        userInfo = authService.getUserInfo();
                        url = wcConfig.api.contacts.url
                            + '?since=' + lastPullTimestamp
                            + '&dependents=' + wcConfig.api.contacts.dependents;
                        $http.defaults.headers.common['x-stellar-token'] = userInfo.token;
                        $http.get(url)
                            .then(function(result) {
                                /* Converts array in form of [{key:2,..},{key:4,..},...] to an object in form of
                                 * {2:{key:2,..}, 4:{key:4,..},...}. Combines newly pulled contacts with those
                                 * already pulled, if any.
                                 *
                                 * This provides us with an object of contact entries whose keys are the contact keys.
                                 * As subsequent calls add or replace contact entries, updating the containing
                                 * object is quick and efficient.
                                 */
                                let pulledContacts = result.data.data;
                                if (pulledContacts.length > 0) {
                                    contacts = pulledContacts.reduce(function (previousValue, currentValue) {
                                        previousValue[currentValue.key] = currentValue;
                                        return previousValue;
                                    }, contacts);
                                }

                                console.log(contacts);
                                return contacts;
                            })
                            .then(null, function(err) {
                                throw new Error(err);
                            });

                        // reset timestamp
                        lastPullTimestamp = Math.round((new Date()).getTime() / 1000);

                    }



                };

            }
        ]);


})(window, window.angular);