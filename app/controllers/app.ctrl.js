export default class appCtrl {
	/* @ngInject */	
	constructor($http, $base64, $rootScope){
		this.rootScope = $rootScope;
		this.base64 = $base64;
		this.http = $http;
		//HEADER
		this.items = ['ONLY FAVORITE','SEARCH'];
		this.icons = ["fa fa-star-o", "fa fa-search"];
		//SEARCH
		this.selectOptions = [{text : 'Movie', value : 'movie'},
					  		  {text : 'Series' , value : 'series'},
					  		  {text : 'Episode' , value : 'episode'}];
		this.selected = this.selectOptions[0];
		this.pages = [1,2,3,4,5,6,7,8,9];
		this.page = this.pages[0];
		this.searchInput = "";
		this.yearInput = "";

		this.loginInput = "";
		this.passInput = "";
		$rootScope.user = "Anonymus user";
		this.user = $rootScope.user;
		this.noUsersHere = true;
		// result of search
		this.favorites = [];
		this.searchResult = [];
	}

	clickTarget(target){
		switch(target) {
   		case "ONLY FAVORITE":
   			this.onlyFavorite();
   		    break;
   		case "SEARCH":
   			this.hideSearch();
   		    break;
   		default:
   		    break; 
		}
	}

	onlyFavorite(){
		this.searchResult = this.favorites;
	}

	hideSearch(){
		angular.element(document.querySelector(".searchSection")).toggleClass('hide-search-js');
		angular.element(document.querySelector(".filtersSection")).toggleClass('hide-search-js');
		angular.element(document.querySelector(".moviesSection")).toggleClass('padding-if-search-hidden-js');
	}

	getData(data){
		self = this;

		this.http({
			method: 'GET',
			url: `http://localhost:3000/s=${data.searchInput}&y=${data.yearInput}&type=${data.selectedValue}&plot=full&r=json&page=${data.page}`
		}).then(function successCallback(response) {
			console.log(response);
			if (response.status !== 404) {
				self.parseResponse(response);
			}
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	parseResponse(response){
		var concate = this.favorites.concat(response.data);
		//Uniq elements only(make sure we do not duplicate favorite films)
		function unique(arr) {
			var result = [];
			
			nextInput:
				for (var i = 0; i < arr.length; i++) {
					var str = arr[i]; 
				for (var j = 0; j < result.length; j++) { 
					if (result[j].Title == str.Title) continue nextInput; 
				}
					result.push(str);
				}
				return result;
		}

		var result = unique(concate);
		console.log(result);
		this.searchResult = result;
	}

	search(){
		this.getData({
			searchInput  : this.searchInput,
			yearInput    : this.yearInput,
			selectedValue: this.selected.value,
			page         : this.page
		});
	}

	setPage(page){
		this.page = page;
		this.search();
	}

	login(){
		var self = this;

		var auth = this.base64.encode(`${this.loginInput}:${this.passInput}`), 
    		headers = {"Authorization": "Basic " + auth},
    		url = "http://localhost:3000/login";

		this.http.get(url, {headers: headers}).then(function (response) {
			self.rootScope.user = response.data.username;
			self.noUsersHere = false;
			self.user = response.data.username;

			self.searchResult = [];
			self.renderFavorite();

			console.log(response);
		}, function errorCallback(response) {
			self.rootScope.user = "Anonymus user";
			console.log(response);
		});
	}

	toggleFavorite(e){
		var target = e.target;
		var movie = target.parentNode.parentNode.parentNode;
		var title = movie.children[0].children[0].children[0].innerHTML;

		target.classList.toggle('star-shine-js');

		this.http({
			method: 'POST',
			url: `http://localhost:3000/toggleFavorite=${title}&user=${this.user}`
		}).then(function successCallback(response) {
			console.log(response);
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	renderFavorite(){
		const MOVIES_PLACE_IN_DOM = document.querySelector('.moviesSection .nonFavorites');

		var self = this;

		this.http({
			method: 'GET',
			url: `http://localhost:3000/getFavorites&user=${this.user}`
		}).then(function successCallback(response) {
			self.favorites = response.data;
			self.searchResult = self.searchResult.concat(self.favorites);
			console.log(self.favorites);
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	isFavorite(el){
		var question = el.FavoriteForThisUsers.indexOf(this.user) !== -1;
		return question;
	}

}