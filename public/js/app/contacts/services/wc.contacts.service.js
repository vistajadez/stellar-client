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
            '$q',
            function contactsServiceFactory(authService, $http, wcConfig, $q) {
                var contacts = {};
                var lastPullTimestamp = ''; // every time we pull from server, we'll set this

                return {
                    /**
                     * Load Contacts.
                     * Refresh the contacts list with any updates that have occurred on the server since our last check.
                     *
                     * Returns a promise.
                     */
                    loadContacts: function() {
                        return $q(function(resolve, reject) {
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
                            $http({method: 'GET', url: url, headers: {
                                'x-stellar-token': userInfo.token
                            }})
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

                                    resolve(contacts);

                                })
                                .then(null, function(err) {
                                    reject(err);
                                });

                            // reset timestamp
                            lastPullTimestamp = Math.round((new Date()).getTime() / 1000);
                        });
                    },

                    /**
                     * Get Contacts.
                     *
                     * Returns a reference to our list of contacts.
                     */
                    getContacts: function() {
                        return contacts;
                    }



                };

            }
        ]);


})(window, window.angular);