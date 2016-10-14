import angular from "angular";
import ngRoute from "angular-route";

import appCtrl   from "./controllers/app.ctrl";
import movieCtrl from "./controllers/movie.ctrl";

// CSS
import reset         from  "./scss/reset.scss";
import globalStyles  from  "./scss/global.scss";
import header        from  "./scss/header.scss";
import search        from  "./scss/search.scss";
import filters       from  "./scss/filters.scss";
import movies        from  "./scss/movies.scss";
import js            from  "./scss/jsStyles.scss";
import details       from  "./scss/details.scss";

angular.module('app',[ngRoute]) 
	.controller('appCtrl', appCtrl)
	.controller('movieCtrl', movieCtrl)
	.config(function($routeProvider) {
		/* @ngInject */	
		$routeProvider
			.when("/movie/:name", {
				template: require("./templates/movie.tmpl.html"),
				controller: 'movieCtrl',
				controllerAs: 'mov'
			})
			.otherwise({
				redirectTo: '/'
			})
	});

//must be at the bottom of this file
angular.bootstrap(document, ['app']); 
