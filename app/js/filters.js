'use strict';

/* Filters */

angular.module('myApp.filters', [])
	.filter('interpolate', ['version',
		function(version) {
			return function(text) {
				return String(text).replace(/\%VERSION\%/mg, version);
			};
		}
	])
	.filter('percentage', [
		function() {
			return function(p) {

				return p.toFixed(2)+"%";
			};
		}
	])
	.filter('currency', [
		function() {
			return function(c) {
				return "$" + c.toFixed(2);
			};
		}
	])
	.filter('date', [
		function() {
			return function(d) {
				return (d.getMonth() + 1) + "/" + d.getFullYear();
			};
		}
	]);