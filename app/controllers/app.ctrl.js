export default class appCtrl {
	/* @ngInject */	
	constructor($http){

		this.http = $http;
		//HEADER
		this.items = ['DELETE ALL','ONLY FAVORITE','SEARCH'];
		this.icons = ["fa fa-trash-o", "fa fa-star-o", "fa fa-search"];
		//SEARCH
		this.selectOptions = [{text : 'Movie', value : 'movie'},
					  		  {text : 'Series' , value : 'series'},
					  		  {text : 'Episode' , value : 'episode'}];
		this.selected = this.selectOptions[0];
		this.pages = [1,2,3,4,5,6,7,8,9];
		this.page = this.pages[0];
		this.searchInput = "";
		this.yearInput = "";
		// result of search
		this.searchResult = [];
	}

	clickTarget(target){
		switch(target) {
   		case "DELETE ALL":
   			this.deleteAll();
   		    break;
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

	deleteAll(){
		this.searchResult = [];
		localStorage.clear();
		this.clearMovies();
	}

	onlyFavorite(){
		this.clearMovies();
		this.searchResult = [];
		this.renderFavorite();
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
			url: `http://www.omdbapi.com/?s=${data.searchInput}&y=${data.yearInput}&type=${data.selectedValue}&plot=full&r=json&page=${data.page}`
		}).then(function successCallback(response) {
			self.parseResponse(response);
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	parseResponse(response){	
		var filtered = response.data.Search.filter((item, i, arr) =>{
			if (localStorage.getItem(`${item.Title}`) === null) {
				return true;
			} else {
				return false;
			}
		});
		this.searchResult = filtered;
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
		this.refreshData();
	}

	addToFavorite(e){
		var target = e.target;
		var movie = target.parentNode.parentNode.parentNode;
		var title = movie.children[0].children[0].children[0].innerHTML;

		target.classList.toggle('star-shine-js');

		if (localStorage.getItem(`${title}`) != null) {
			localStorage.removeItem(`${title}`);
		} else{
			localStorage.setItem(`${title}`, movie.innerHTML);
		}
	}

	renderFavorite(){
		const MOVIES_PLACE_IN_DOM = document.querySelector('.moviesSection .nonFavorites');
		
		for (let key in localStorage){
			if (key.indexOf('comments') == -1) {
				let movie = document.createElement('div');
				movie.className = "movie fav";
				movie.innerHTML = localStorage[key];
				MOVIES_PLACE_IN_DOM.appendChild(movie);
			}
		}
	}

	clearMovies(){
		const MOVIES_PLACE_IN_DOM = document.querySelector('.moviesSection .nonFavorites');
	
		while (MOVIES_PLACE_IN_DOM.children[0]) {
		    MOVIES_PLACE_IN_DOM.removeChild(MOVIES_PLACE_IN_DOM.lastChild);
		}	
	}

	refreshData(){
		this.searchResult = [];
		this.clearMovies();
		this.renderFavorite();
		this.search();
	}

}