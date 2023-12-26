const BaseService = require("./base_service");
const PaginationMapper = require('../mappers/pagination_mapper');

class GenreService extends BaseService {
  constructor({ genreRepository }) {
    super(genreRepository, 'user', PaginationMapper.toPagination);
  }
}

module.exports = GenreService;
