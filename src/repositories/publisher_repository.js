const { PublisherModel } = require('../model/publishers');
const BaseRepository = require('./base_repository');

class PublisherRepository extends BaseRepository {
  constructor() {
    super(PublisherModel);
  }
}

module.exports = PublisherRepository;
