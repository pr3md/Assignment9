describe('ChatsCtrl', function() {
	var scope;
	
	beforeEach(angular.mock.module('starter.controllers'));
	beforeEach(angular.mock.inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		$controller('ChatsCtrl', {$scope: scope});
	}));

	it("Checks Kelvin to Fahrenheit Conversion", function () {
		var kelvin = "300";
        expect(scope.testKtoF(kelvin)).toEqual(80);
	});
});