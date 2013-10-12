'use strict';

/* Controllers */

angular.module('myApp.controllers', []).controller('mainController', ['$scope', '$http', 'DataResource', '_',
	function($scope, $http, DataResource, _) {


		var analyzeNumbers = function(data) {

			var numbers = []; //numbers of a single firm
			var beginning = new Date(2001, 11 - 1, 1);
			var spurtMin = 0;
			var spurtMax = 0;
			var spurtGrowth = 0;
			var spurts = [];
			var spurtStartDate = new Date(beginning);
			var spurtEndDate = new Date(beginning);
			var trendingUp = true;

			var current = 0;
			var previous = 0;

			for (var i = 0; i < data.length; i++) {

				//numbers for one firm
				numbers = data[i].numbers;

				//analyze the numbers in this firm
				for (var j = 0; j < numbers.length; j++) {

					current = numbers[j];
					previous = numbers[j - 1];

					if (previous) {

						if (current > previous) {
							if (trendingUp == false) {
								//new spurt
								spurtMin = previous;
								trendingUp = true;
								spurtStartDate.setMonth(beginning.getMonth()+j);

							}

							spurtGrowth = (current - spurtMin) / spurtMin * 100;
						} else {

							if (trendingUp == true) {
								spurtMax = previous;
								spurtEndDate.setMonth(beginning.getMonth() + j);

								spurts.push({
									"growth": spurtGrowth,
									"min": spurtMin,
									"max": spurtMax,
									"startDate": new Date(spurtStartDate),
									"endDate": new Date(spurtEndDate)
								});

								//reset date to record next spurt
								spurtStartDate.setFullYear(beginning.getFullYear());
								spurtEndDate.setFullYear(beginning.getFullYear());
								trendingUp = false;
							}
						}
					} else {
						spurtMin = current;
					}
				}

				//return the spurt object with the highest growth spurt from the numbers
				data[i].largestSpurt = _.max(spurts, function(spurt) {
					return spurt.growth;
				});
				spurts = [];

				//calculate total return from day 1 to 10 years later
				data[i].totalReturn = (numbers[numbers.length-1] - numbers[0])/numbers[0] * 100;
			}

		};

		$scope.init = function() {

			//GET: all data
			DataResource.get({}, function(data) {

				var firmDataArray = data.values;

				analyzeNumbers(firmDataArray);

				$scope.dataArray = data.values;

			});
		};


	}
]);