'use strict';

describe('wc.navbar.controller', function() {
   var scope, controller;

   beforeEach(module('wc.navbar.controller'));
   beforeEach(module('wc.config'));
   beforeEach(module('ui.router.state'));

   beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      controller = $controller('WcNavbarController', {$scope: scope}); 
   }));

   it('should have an initial navBarCollapsed scope value that evaluates to true', function() {
      expect(scope.navbarCollapsed).toBeTruthy();
   });

});
