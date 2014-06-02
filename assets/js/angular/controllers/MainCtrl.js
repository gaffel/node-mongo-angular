meetingsModule.controller('MainCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {
	$scope.meetings = [];
	$scope.members = [];
	$scope.stats = {};

	var initFormData = {
		entries: 1000
	};
	$scope.formData = angular.copy(initFormData);

	var getMeetings = function () {
		var deferred = $q.defer();

		try {
			$http({
				url: meetingsModule.endpoints.meetings,
				method: 'GET'
			}).success(function (data) {
				$scope.meetings = data;
			});
		} catch (e) {
			deferred.reject(e);
		}

		return deferred.promise;
	};

	var getMembers = function () {
		var deferred = $q.defer();

		try {
			$http({
				url: meetingsModule.endpoints.members,
				method: 'GET'
			}).success(function (data) {
				$scope.members = data;
			});
		} catch (e) {
			deferred.reject(e);
		}

		return deferred.promise;
	};

	var getStats = function () {
		var deferred = $q.defer();

		try {
			$http({
				url: meetingsModule.endpoints.statistics,
				method: 'GET'
			}).success(function (data) {
				$scope.stats = data;
			});
		} catch (e) {
			deferred.reject(e);
		}

		return deferred.promise;
	};
	getMeetings().then(getMembers()).then(getStats());

	$scope.blockUI = false;
	$scope.generateMeetings = function () {
		$scope.blockUI = true;

		$http({
			url: meetingsModule.endpoints.meetings,
			method: 'POST',
			data: {data: $scope.formData}
		}).success(function () {
			getMeetings().then(getMembers()).then(getStats());

			$scope.blockUI = false;
			$scope.formData = angular.copy(initFormData);
		});
		return false;
	}
}]);