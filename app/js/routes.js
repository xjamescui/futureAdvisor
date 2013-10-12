window.app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'partials/main.html',
			controller: 'mainController'
		});
		$routeProvider.otherwise({
			redirectTo: '/'
		});
	}
]);