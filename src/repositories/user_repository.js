const BaseRepository = require('./base_repository');
const { UserModel } = require('../model/users');

class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }
}

module.exports = UserRepository;
