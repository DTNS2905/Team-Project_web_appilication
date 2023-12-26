const PaginationMapper = require('../mappers/pagination_mapper');
const BaseService = require('./base_service');

class BookService extends BaseService {
  constructor({
    bookRepository, authorRepository, publisherRepository, genreRepository,
  }) {
    super(bookRepository, 'book', PaginationMapper.toPagination);
    this.authorRepository = authorRepository;
    this.publisherRepository = publisherRepository;
    this.genreRepository = genreRepository;
  }

  search(inputString = '') {
    const bookRegex = inputString;
    const aggregate = [
      {
        $match: {
          title: { $regex: bookRegex, $options: 'x' },
        },
      },
    ];
    return this.repo.aggregate(aggregate);
  }

  getPage(page = 1, perPage = 10, sort = { _id: 1 }) {
    const aggregate = [
      {
        $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          authorId: {
            $toObjectId: '$authorId',
          },
          publisherId: {
            $toObjectId: '$publisherId',
          },
        },
      },
      {
        $addFields: {
          genreId: {
            $toObjectId: '$genre',
          },
        },
      },
      {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: 'authors',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authors',
        },
      },
      {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: 'publishers',
          localField: 'publisherId',
          foreignField: '_id',
          as: 'publishers',
        },
      },
      {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: 'genres',
          localField: 'genreId',
          foreignField: '_id',
          as: 'genres',
        },
      },
      {
        $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          authorName: {
            $first: '$authors',
          },
          publisherName: {
            $first: '$publishers',
          },
          genreName: {
            $first: '$genres',
          },
        },
      },
      {
        $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          authorName: '$authorName.fullname',
          publisherName: '$publisherName.fullname',
          genreName: '$genreName.title',
        },
      },
    ];
    return Promise.all([
      this.authorRepository.find({}),
      this.publisherRepository.find({}),
      this.genreRepository.find({}),
      this.repo.aggregate(aggregate)
        .sort(sort)
        .skip((perPage * page) - perPage)
        .limit(perPage),
      this.repo.count({}),
    ]).then(([authors, publishers, genres, books, bookCount]) => {
      const result = {};
      result[this.name] = PaginationMapper.toPagination(books, bookCount, page, perPage);
      result.authors = authors;
      result.publishers = publishers;
      result.genres = genres;
      return result;
    });
  }

  getById(id) {
    const aggregate = [
      {
        $set: {
          _id: { $toString: '$_id' },
        },
      },
      {
        $match: {
          _id: id,
        },
      },
      {
        $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          authorId: {
            $toObjectId: '$authorId',
          },
          publisherId: {
            $toObjectId: '$publisherId',
          },
        },
      },
      {
        $addFields: {
          genreId: {
            $toObjectId: '$genre',
          },
        },
      },
      {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: 'authors',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authors',
        },
      },
      {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: 'publishers',
          localField: 'publisherId',
          foreignField: '_id',
          as: 'publishers',
        },
      },
      {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: 'genres',
          localField: 'genreId',
          foreignField: '_id',
          as: 'genres',
        },
      },
      {
        $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          authorName: {
            $first: '$authors',
          },
          publisherName: {
            $first: '$publishers',
          },
          genreName: {
            $first: '$genres',
          },
        },
      },
      {
        $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          authorName: '$authorName.fullname',
          publisherName: '$publisherName.fullname',
          genreName: '$genreName.title',
        },
      },
    ];
    return this.repo.aggregate(aggregate)
      .limit(1)
      .then((books) => books[0]);
  }
}

module.exports = BookService;
