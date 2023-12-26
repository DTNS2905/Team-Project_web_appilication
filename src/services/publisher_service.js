const BaseService = require("./base_service");
const PaginationMapper = require('../mappers/pagination_mapper');

class PublisherService extends BaseService {
  constructor({ publisherRepository }) {
    super(publisherRepository, 'publisher', PaginationMapper.toPagination);
  }
}

module.exports = PublisherService;
