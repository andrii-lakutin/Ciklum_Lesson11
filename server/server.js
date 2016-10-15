import express from 'express';
import db from './db.js';
import Movie from "./schemas/movie";
import http from 'http';

var app = express();

// Movie.update({title: 'Test'}, {$set: {year: '1999999998'}}, function(err, result){
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log('Success!');
// 	}
// });
// Movie.update({title: 'Test'}, {$push: {comments: '3333'}}, {multi : true} , function(err, result){
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log('Success!');
// 	}
// }, true);

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get('/', function (req, res) {
//   console.log('someoneconnect');
//   res.send('Hello World!');
// });

app.get('/s=:searchInput&y=:year?&type=:type?&page=:page?', function (req, res) {

	console.log('someonewannasomedata');

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
			Movie.find({title: item.Title}).exec(function(err, data){
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