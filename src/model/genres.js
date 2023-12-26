const mongoose = require('mongoose');

const genresSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  description: {
    type: String,
    required: false,
  },
});

const Genres = mongoose.model('Genres', genresSchema);
exports.GenresModel = Genres;
