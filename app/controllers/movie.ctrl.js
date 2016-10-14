export default class movieCtrl {
	/* @ngInject */
	constructor($routeParams, $scope, $http) {

		$scope.name = $routeParams.name;

		$scope.title = "";
		$scope.year = "";
		$scope.runtime = "";
		$scope.poster = "";
		$scope.plot = "";
		$scope.score ="";

		$scope.input = "";
		$scope.comments = [];

		$scope.send = function(){
			if ($scope.input) {
				$scope.comments.push('Anonymus user : ' + $scope.input);
				$scope.input = "";
				localStorage.setItem(`${$scope.title} comments`, $scope.comments);
			}

		}	

		$scope.http = function(newValue){
			$http({
			method: 'GET',
			url: `http://www.omdbapi.com/?t=${newValue}&plot=full&r=json`
			}).then(function successCallback(response) {
				$scope.parseResponse(response);
			}, function errorCallback(response) {
				console.log(response);
			});
		};

		$scope.parseResponse = function(response){

			var data = response.data;
			$scope.title = data.Title;
			$scope.year = data.Year;
			$scope.runtime = data.Runtime;
			$scope.poster = data.Poster;
			$scope.plot = data.Plot;
			$scope.score = data.imdbRating;

			if (localStorage.getItem(`${$scope.title} comments`) != null) {
				$scope.comments = localStorage.getItem(`${$scope.title} comments`).split(',');
			}

		}

    	$scope.$watch(function($scope){
    		return $scope.name;
    	}, function(oldValue, NewValue){
    		$scope.http(NewValue);
    	});
	}
}
