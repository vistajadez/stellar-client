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
                var userInfo = {status: "success", data: {user: 1, token: 'test'}};
                return {
                    login: function(email, password) {
                        var deferred = $q.defer();

                        $http.defaults.headers.common['x-stellar-email'] = email;
                        $http.defaults.headers.common['x-stellar-password'] = password;
                        $http.get("https://livingstellar.com/api/v1/auth")
                           .then(function(result) {
                           if (result.data.status === 'success') {
                               userInfo = {
                                   token: result.data.data.token,
                                   userId: result.data.data.user
                               };

                               deferred.resolve(userInfo);
                           } else {
                               deferred.reject(result.data.data.message);
                           }

                        }, function(error) {
                            deferred.reject(error);
                        });

                        return deferred.promise;
                    },
                    getUserInfo: function() {
                        return userInfo;
                    }


                };

            }
        ]);


})(window, window.angular);