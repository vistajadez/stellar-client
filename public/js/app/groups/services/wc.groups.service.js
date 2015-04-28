(function (window, angular) {
    "use strict";

    /**
     * @ngdoc service
     * @name groupsService
     *
     * @description
     * Provides all inter-app group persistence functionality.
     *
     */
    angular.module('wc.groups.service', [])
        .factory('groupsService', [
            'authService',
            '$http',
            'wcConfig',
            '$q',
            function groupsServiceFactory(authService, $http, wcConfig, $q) {
                var groups = {};
                var lastPullTimestamp = ''; // every time we pull from server, we'll set this

                return {
                    /**
                     * Load Groups.
                     * Refresh the groups list with any updates that have occurred on the server since our last check.
                     *
                     * Returns a promise.
                     */
                    loadGroups: function() {
                        return $q(function(resolve, reject) {
                            var userInfo;
                            var url;

                            if (!authService.isLoggedIn()) {
                                throw new Error(wcConfig.errorMessages.notAuthorized);
                            }

                            // refresh from server since last pull
                            userInfo = authService.getUserInfo();
                            url = wcConfig.api.groups
                                + '?since=' + lastPullTimestamp;
                            $http({method: 'GET', url: url, headers: {
                                'x-stellar-token': userInfo.token
                            }})
                                .then(function(result) {
                                    /* Converts array in form of [{key:2,..},{key:4,..},...] to an object in form of
                                     * {2:{key:2,..}, 4:{key:4,..},...}. Combines newly pulled groups with those
                                     * already pulled, if any.
                                     *
                                     * This provides us with an object of group entries whose keys are the group keys.
                                     * As subsequent calls add or replace group entries, updating the containing
                                     * object is quick and efficient.
                                     */
                                    let pulledGroups = result.data.data;
                                    if (pulledGroups.length > 0) {
                                        groups = pulledGroups.reduce(function (previousValue, currentValue) {
                                            previousValue[currentValue.key] = currentValue;
                                            return previousValue;
                                        }, groups);
                                    }

                                    resolve(groups);

                                })
                                .then(null, function(err) {
                                    reject(err);
                                });

                            // reset timestamp
                            lastPullTimestamp = Math.round((new Date()).getTime() / 1000);
                        });
                    },

                    /**
                     * Get Groups.
                     *
                     * Returns a reference to our list of groups.
                     */
                    getGroups: function() {
                        return groups;
                    }



                };

            }
        ]);


})(window, window.angular);