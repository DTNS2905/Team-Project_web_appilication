const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
  authorId: {
    type: String,
    required: true,
  },
  publisherId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  genre: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  price: {
    type: Number,
    required: true,
    min: 0.0,
    max: 99999999,
  },
  image: {
    type: String,
  },
});

const Books = mongoose.model('Books', booksSchema);
exports.BooksModel = Books;
