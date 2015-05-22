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
                /**
                 * Load Groups.
                 * Refresh the groups list with any updates that have occurred on the server since our last check.
                 *
                 * Returns a promise.
                 */
                var loadGroups = function() {
                    return $q((resolve, reject) => {
                        var userInfo;
                        var url;

                        if (!authService.isLoggedIn()) {
                            throw new Error(wcConfig.errorMessages.notAuthorized);
                        }

                        // refresh from server since last pull
                        userInfo = authService.getUserInfo();
                        url = wcConfig.api.groups
                            + '?since=' + this.lastPullTimestamp;
                        $http({method: 'GET', url: url, headers: {
                            'x-stellar-token': userInfo.token
                        }})
                            .then((result) => {
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
                                    this.groups = pulledGroups.reduce( (previousValue, currentValue) => {
                                        previousValue[currentValue.key] = currentValue;
                                        return previousValue;
                                    }, this.groups);
                                }

                                resolve(this.groups);

                            })
                            .then(null, (err) => {
                                reject(err);
                            });

                        // reset timestamp
                        this.lastPullTimestamp = Math.round((new Date()).getTime() / 1000);
                    });
                };


                // return the model
                return {
                    groups: {},
                    lastPullTimestamp: '',
                    load: loadGroups
                };

            }
        ]);


})(window, window.angular);