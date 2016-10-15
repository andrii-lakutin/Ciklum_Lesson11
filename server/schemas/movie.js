import mongoose from 'mongoose';

var movieSchema = mongoose.Schema({
	poster: String,
	title: String,
	plot: String,
	runtime: String,
	score: String,
	year: String,
	favoriteForThisUsers: [String],
	comments: [String]
});

var Movie = mongoose.model('Movie', movieSchema);

export default Movie