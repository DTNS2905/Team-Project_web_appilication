const PaginationMapper = require('../mappers/pagination_mapper');

class BookController {
  constructor({
    bookService, bookBodyMapper,
  }) {
    this.service = bookService;
    this.paginationMapper = PaginationMapper;
    this.bodyMapper = bookBodyMapper;
  }

  getById(req, res, page) {
    let status = 200;
    const { bookId } = req.params;
    return this.service.getById(bookId)
      .then((book) => {
        if (book) {
          res.status(status).render(page, {
            message: '',
            book,
          });
        } else {
          status = 404;
          res.status(status).render(page, {
            message: 'Book not found',
            book: null,
          });
        }
      });
  }

  getPage(req, res, _page) {
    const { page, perPage } = this.paginationMapper.fromRequest(req);
    return this.service.getPage(page, perPage, { _id: 1 })
      .then((data) => res.render(_page, {
        books: data.book.data,
        current: data.book.current,
        pages: data.book.pages,
        message: '',
        pre: data.book.pre,
        next: data.book.next,
      }));
  }

  create(req, res, page) {
    const bookBody = this.bodyMapper.fromRequest(req);
    return this.service.create(bookBody)
      .then((newBook) => {
        if (newBook) {
          return res.redirect(page);
        }
      });
  }

  update(req, res, page) {
    let message = 'Update book successfully';
    const { bookId } = req.params;
    const book = {};
    if (req.body.title) {
      book.title = req.body.title;
    }
    if (req.body.genre) {
      book.genre = req.body.genre;
    }
    if (req.body.price) {
      book.price = req.body.price;
    }
    if (req.body.publisherId) {
      book.publisherId = req.body.publisherId;
    }
    if (req.body.authorId) {
      book.authorId = req.body.authorId;
    }
    book.image = req.body.image;
    this.service.update(bookId, book)
      .catch((err) => {
        console.error(err);
        message = err.toString();
      }).then((_) => {
        res.status(200).redirect(page);
      });
  }

}

module.exports = BookController;
