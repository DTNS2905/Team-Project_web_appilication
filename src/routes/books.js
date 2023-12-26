const express = require('express');
const { isAuthenticated } = require('../middleware/authenticate');

const router = express.Router();
const PaginationMapper = require('../mappers/pagination_mapper');
const container = require('../loaders/register');

const { bookService } = container.cradle;

router.post('/search', isAuthenticated, (req, res) => {
  const bookRegex = req.body.input;
  return bookService.search(bookRegex)
    .then((data) => res.render('pages/books', {
      books: data,
      current: 1,
      pages: 1,
      message: '',
      pre: 1,
      next: 1,
    })).catch(console.error);
});

router.get('/:bookId', isAuthenticated, (req, res) => {
  let status = 200;
  const { bookId } = req.params;
  return bookService.getById(bookId)
    .then((book) => {
      if (book) {
        res.status(status).render('pages/book_detail', {
          message: '',
          book,
        });
      } else {
        status = 404;
        res.status(status).render('pages/book_detail', {
          message: 'Book not found',
          book: null,
        });
      }
    });
});

router.get('/', isAuthenticated, (req, res) => {
  const { page } = PaginationMapper.fromRequest(req);
  return bookService.getPage(page, 12, { _id: 1 })
    .then((data) => res.render('pages/books', {
      books: data.book.data,
      current: data.book.current,
      pages: data.book.pages,
      message: '',
      pre: data.book.pre,
      next: data.book.next,
    })).catch(console.error);
});

module.exports = router;
