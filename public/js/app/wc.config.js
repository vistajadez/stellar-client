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
            api: {
                auth: 'https://livingstellar.com/api/v1/auth',
                contacts: {
                    url: 'https://livingstellar.com/api/v1/contacts',
                    dependents: 'relationships,touches,stellars,emails,phones'
                }
            },
            errorMessages: {
                notAuthorized: 'Not authorized'
            }
        });

})(window, window.angular);

