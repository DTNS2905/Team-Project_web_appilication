const express = require('express');
const { isAuthenticated } = require('../middleware/authenticate');
const container = require('../loaders/register');

const { bookService } = container.cradle;

const router = express.Router();

/* GET home page. */
router.get('/', isAuthenticated, (req, res) => bookService.getPage(1, 4, { _id: 1 })
  .then((book) => {
    console.log(book.book);
    res.render('index', {
      message: '',
      ...book,
      count: 0,
      count1: 0,
    });
  }).catch((err) => {
    console.error(err);
    res.render('error', { message: 'Server Error', error: { status: 500, stack: err } });
  }));

  

module.exports = router;
