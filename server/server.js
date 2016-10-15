import express from 'express';
import db from './db.js';
import Movie from "./schemas/movie";
import http from 'http';

var app = express();

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//1 ITEM
app.get('/t=:title', function (req, res) {
    Movie.find({Title: req.params.title}).exec(function(err, data){
    	if (err) {
    		console.log(err);
    	} else {
    		res.send(data[0]);
    	}
    });
});

//COMMENTS
app.post('/comment=:comment&title=:title', function (req, res) {
	Movie.update({Title: req.params.title}, {$push: {Comments: req.params.comment}}, function(err, result){
		if (err) {
			console.log(err);
		} else {
			console.log(`New comment on film ${req.params.title} : ${req.params.comment}`);
		}
	});
	res.send('Comment added!');
});

// //FAVORITE
// app.post('/setFavorite=:title', function (req, res) {
// 	Movie.update({Title: req.params.title}, {$set: {Comments: req.params.comment}}, function(err, result){
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log();
// 		}
// 	});
// 	res.send('Favorite added!');
// });



//10 ITEMS
app.get('/s=:searchInput&y=:year?&type=:type?&page=:page?', function (req, res) {

	var answer = [];

	sendHttpRequest(req.params, '?s');

	function sendHttpRequest(params, typeOfSearch){
		//OMDB API bug : type===undefined ? error
		params.type === undefined ? params.type = '': params.type = params.type;
	
		var options = {
			host: 'www.omdbapi.com',
			path: `/${typeOfSearch}=${params.searchInput}&y=${params.year}&type=${params.type}&plot=full&r=json&page=${params.page}`
		};
		
		var req = http.get(options, function(response) {
			console.log('PATH*******' + options.path);
			var bodyChunks = [];
			response.on('data', function(chunk) {
				bodyChunks.push(chunk);
			}).on('end', function() {
				var body = Buffer.concat(bodyChunks);
				if (typeOfSearch === '?s') {
					analyse(body);
				} else{
					addToDb(body);
				}
			})
		});
			
		req.on('error', function(e) {
			console.log('*********ERROR********: ' + e.message);
		});
	}

	function analyse (body){
		var data = JSON.parse(body.toString());
		data.Search.forEach((item,index)=>{
			Movie.find({Title: item.Title}).exec(function(err, data){
				if (err) {
					console.log(err);
				} else{
					//Film not exist in db? Let's add it!
					if(!data.length){
						//Spaces cause errors -> replace them to %20
						sendHttpRequest({searchInput: item.Title.split(' ').join('%20')}, '?t');
					//Film already in Db? Great, return it as answer from server!
					} else {
						//DB return data as array with 1 item, so we use data[0] 
						answer.push(data[0]);
						if (answer.length === 10) {
							//send films to client
							res.send(answer);
						}
					}
				}
			});	
		});
	}

	function addToDb (body){
		var data = JSON.parse(body.toString());
		
		var movie = new Movie({
			Poster: data.Poster,
			Title: data.Title,
			Plot: data.Plot,
			Runtime: data.Runtime,
			Score: data.imdbRating,
			Year: data.Year,
			Comments: []
		});
	
		movie.save(function (err, test) {
	  		if (err) return console.error(err);
		});

		//Film added to db, add it to anwer from server!
		answer.push(movie);

		if (answer.length === 10) {
			//send films to client
			res.send(answer);
		}
	}
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});