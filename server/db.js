import mongoose from 'mongoose';

var db = mongoose.connect('mongodb://Lucky:veryhardpassword@ds029655.mlab.com:29655/moviesapp');

export default db