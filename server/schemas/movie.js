import mongoose from 'mongoose';

var movieSchema = mongoose.Schema({
	Poster: String,
	Title: String,
	Plot: String,
	Runtime: String,
	Score: String,
	Year: String,
	FavoriteForThisUsers: [String],
	Comments: [String]
});

var Movie = mongoose.model('Movie', movieSchema);

export default Movie