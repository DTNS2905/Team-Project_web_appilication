const { AuthorModel } = require('../model/authors');
const BaseRepository = require('./base_repository');

class AuthorRepository extends BaseRepository {
  constructor() {
    super(AuthorModel);
  }
}

module.exports = AuthorRepository;
