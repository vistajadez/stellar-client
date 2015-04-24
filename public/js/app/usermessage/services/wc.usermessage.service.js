(function (window, angular) {
    "use strict";

    /**
     * @ngdoc service
     * @name usermessageService
     *
     * @description
     * Provides consistent messaging to web user.
     *
     */
    angular.module('wc.usermessage.service', [])
    .factory('usermessageService', [
            "growl",
            function usermessageServiceFactory(growl) {
                return {
                    growlSuccess(msg, options) {
                        growl.success(msg, options);
                    },
                    growlInfo(msg, options) {
                        growl.info(msg, options);
                    },
                    growlWarn(msg, options) {
                        growl.warn(msg, options);
                    },
                    growlError(msg, options) {
                        growl.error(msg, options);
                    }
                };
            }
        ]);
})(window, window.angular);