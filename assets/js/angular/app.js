if (window.endPoints) {
    (function(endPoints) {
        window.meetingsModule = angular.module('Meetings', function($httpProvider)
        {
            // Use x-www-form-urlencoded Content-Type
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	        //$httpProvider.defaults.useXDomain = true;
	        //delete $httpProvider.defaults.headers.common['X-Requested-With'];

            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = function (data) {
                return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
            };
        })
        .config(function() {
            window.meetingsModule.endpoints = endPoints;
        })
    })(window.endPoints);
}