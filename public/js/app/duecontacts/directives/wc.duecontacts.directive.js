(function (window, angular) {
    "use strict";

    angular.module('wc.duecontacts.directive', [])
        .directive('wcDuecontacts', [
            function() {
                return {
                    restrict: 'E',
                    templateUrl: 'duecontacts.html',
                    scope: {},
                    replace: true,
                    link: function(scope) {



                    }
                };
            }
        ]);

})(window, angular);