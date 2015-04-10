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
            function authServiceFactory($http, $q, $window) {
                var userInfo = {};

                if ($window.sessionStorage.userInfo) {
                    userInfo.id = $window.sessionStorage.userInfo.id;
                    userInfo.token = $window.sessionStorage.userInfo.token;
                } else {
                    userInfo = {id:"", token:""};
                }

                console.log($window.sessionStorage.userInfo);
                return {
                    /**
                     * Login.
                     * @param email
                     * @param password
                     * @returns {*}
                     */
                    login: function(email, password) {
                        var deferred = $q.defer();

                        $http.defaults.headers.common['x-stellar-email'] = email;
                        $http.defaults.headers.common['x-stellar-password'] = password;
                        $http.get("https://livingstellar.com/api/v1/auth")
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
                    }


                };

            }
        ]);


})(window, window.angular);