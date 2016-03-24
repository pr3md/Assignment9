describe('DashCtrl', function() {
	var scope;
	
	beforeEach(angular.mock.module('starter.controllers'));
	beforeEach(angular.mock.inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		$controller('DashCtrl', {$scope: scope});
	}));

	it("Checks Simple Interst Calculation", function () {
		var principle = "5000";
        var term = "12";
        var roi = "4";
        expect(scope.testSI(principle, term, roi)).toEqual(2400);
	});
});