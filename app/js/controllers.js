'use strict';

/* Controllers */

angular.module('myApp.controllers', []).controller('mainController', ['$scope', '$http', 'DataResource', '_',
	function($scope, $http, DataResource, _) {


		/**
		*	Analyzes each firm and their numbers
		*/
		var analyzeNumbers = function(data) {

			var numbers = []; //all 120 numbers of a firm
			var beginning = new Date(2001, 11 - 1, 1); //a reference for calculating spurtStartDate and spurtEndDate
			var spurtMin = 0; //initial value in the spurt
			var spurtMax = 0; //ending value in the spurt
			var spurtGrowth = 0; //return within this spurt
			var spurts = []; //keeps track of all spurts happened for a firm
			var spurtStartDate = new Date(beginning); //record the starting date of a spurt
			var spurtEndDate = new Date(beginning); //record the end date of a spurt
			var trendingUp = true; //checks if we are in a spurt

			var current = 0; //pointer to a number (for the for-loop)
			var previous = 0; //pointer to a number 1 position before current  (for the for-loop)

			//iterate through each firm
			for (var i = 0; i < data.length; i++) {

				//numbers for one firm
				numbers = data[i].numbers;

				//iterate through the numbers in this firm
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

							//update return for this burst
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

								//reset dates and other vars to get ready to record next spurt
								spurtStartDate.setFullYear(beginning.getFullYear());
								spurtEndDate.setFullYear(beginning.getFullYear());
								trendingUp = false;
							}
						}
					} else {
						//you don't have a "previous" if "current" is the first element in the array
						spurtMin = current;
					}
				}

				//return the spurt object with the highest growth spurt from the numbers
				data[i].largestSpurt = _.max(spurts, function(spurt) {
					return spurt.growth;
				});
				//reset spurts array as we move on to analyze another firm
				spurts = [];

				//calculate total return from day 1 to 10 years later
				data[i].totalReturn = (numbers[numbers.length-1] - numbers[0])/numbers[0] * 100;
			}

		};

		$scope.init = function() {

			//GET: all data
			DataResource.get({}, function(data) {

				var firmDataArray = data.values;

				//Main function: does the heavy-lifting for analysis
				analyzeNumbers(firmDataArray);

				$scope.dataArray = data.values;

			});
		};


	}
]);