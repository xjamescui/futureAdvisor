'use strict';

/* Services */

angular.module('myApp.services', [])
//outputs a DataResource service used by the controller through REST
	.factory("DataResource", ['$resource',
		function($resource) {
			return $resource('../data.json', {}, {});
		}
	])
	.factory('_', function() {
		return window._; // assumes underscore has already been loaded on the page
	});