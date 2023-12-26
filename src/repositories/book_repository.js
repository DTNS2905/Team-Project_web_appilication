const { BooksModel } = require('../model/books');
const BaseRepository = require('./base_repository');

class BookRepository extends BaseRepository {
  constructor() {
    super(BooksModel);
  }
}

module.exports = BookRepository;
