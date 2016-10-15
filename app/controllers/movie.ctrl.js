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

				$http({
					method: 'POST',
					url: `http://localhost:3000/comment=${'Anonymus user : ' + $scope.input}&title=${$scope.title}`
				}).then(function successCallback(response) {
					console.log(response);
				}, function errorCallback(response) {
					console.log(response);
				});

				$scope.input = "";
			}
		}	

		$scope.http = function(newValue){
			$http({
			method: 'GET',
			url: `http://localhost:3000/t=${newValue}`
			}).then(function successCallback(response) {
				console.log(response);
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
			$scope.score = data.Score;
			$scope.comments = data.Comments;
		}

    	$scope.$watch(function($scope){
    		return $scope.name;
    	}, function(oldValue, NewValue){
    		$scope.http(NewValue);
    	});
	}
}
