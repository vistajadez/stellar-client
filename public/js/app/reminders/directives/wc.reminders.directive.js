(function (window, angular) {
    "use strict";

    /**
     * @ngdoc directive
     * @name wcReminders
     *
     * @scope
     * @description
     *
     * Display a list of reminders (i.e. anniversaries, birthdays).
     * @example:
     <example>
        <wc-reminders></wc-reminders>
     </example>
     */
    angular.module('wc.reminders.directive', [])
        .directive('wcReminders', [
            function() {
                return {
                    restrict: 'E',
                    templateUrl: 'reminders.html',
                    scope: {},
                    replace: true,
                    link: function(scope) {



                    }
                };
            }
        ]);

})(window, angular);