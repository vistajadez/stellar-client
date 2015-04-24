(function (window, angular) {
    "use strict";

    /**
     * @ngdoc service
     * @name authService
     *
     * @description
     * Provides authentication functionality.
     *
     */
    angular.module('wc.auth.service', [])
        .factory('authService', [
            '$http',
            '$q',
            '$window',
            'wcConfig',
            function authServiceFactory($http, $q, $window, wcConfig) {
                var userInfo;

                if ($window.sessionStorage.userInfo) {
                    userInfo = JSON.parse($window.sessionStorage.userInfo);
                } else {
                    userInfo = {id:"", token:""};
                }

                return {
                    /**
                     * Login.
                     * @param email
                     * @param password
                     * @returns {*}
                     */
                    login: function(email, password) {
                        var deferred = $q.defer();

                        $http({method: 'GET', url: wcConfig.api.auth, headers: {
                            'x-stellar-email': email, 'x-stellar-password': password}
                        })
                           .then(function(result) {
                           if (result.data.status === 'success') {
                               userInfo.id = result.data.data.user;
                               userInfo.token = result.data.data.token;
                               $window.sessionStorage.userInfo = JSON.stringify(userInfo);

                               deferred.resolve(userInfo);
                           } else {
                               deferred.reject(result.data.data.message);
                           }

                        }, function(error) {
                            deferred.reject(error);
                        });

                        return deferred.promise;
                    },

                    /**
                     * Get User Info.
                     * @returns {{userId: string, token: string}}
                     */
                    getUserInfo: function() {
                        return userInfo;
                    },

                    /**
                     * Log out.
                     */
                    logout: function() {
                        userInfo = {id:"", token:""};
                        $window.sessionStorage.userInfo = JSON.stringify(userInfo);
                    },

                    /**
                     * Is Logged In.
                     * @returns {boolean}
                     */
                    isLoggedIn: function() {
                        return userInfo && userInfo.id !== '';
                    }

                };

            }
        ]);


})(window, window.angular);