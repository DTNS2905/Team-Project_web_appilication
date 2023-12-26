const { GenresModel } = require('../model/genres');
const BaseRepository = require('./base_repository');

class GenreRepository extends BaseRepository {
  constructor() {
    super(GenresModel);
  }
}

module.exports = GenreRepository;
