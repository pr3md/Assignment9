describe('AccountCtrl', function() {
	var scope;
	
	beforeEach(angular.mock.module('starter.controllers'));
	beforeEach(angular.mock.inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		$controller('AccountCtrl', {$scope: scope});
	}));

	it("Checks Compound Interst Calculation", function () {
		var principle = 5000;
        var term = 12;
        var roi = 4;
        var n = 2;
		expect(scope.testCI(principle, term, roi, n)).toEqual(8032);
	});
});