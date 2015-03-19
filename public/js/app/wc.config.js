(function (window, angular) {
    "use strict";

    angular.module('wc.config', [])
        .value('version', {
            full: '0.0.1',
            major: '0',
            minor: '0',
            dot: '1',
            codeName: 'squareone'
        })
        .constant('wcConfig', {
            // put config values here

        });

})(window, window.angular);

