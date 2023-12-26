const PaginationMapper = require('../mappers/pagination_mapper');
const BaseService = require('./base_service');

class AuthorService extends BaseService {
  constructor({ authorRepository }) {
    super(authorRepository, 'author', PaginationMapper.toPagination);
  }
}

module.exports = AuthorService;
