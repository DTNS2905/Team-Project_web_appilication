const express = require('express');
const moment = require('moment');

const { hasAdminRole } = require('../middleware/authenticate');
const { AuthorModel } = require('../model/authors');
const Order = require('../model/orders');

const router = express.Router();

const PaginationMapper = require('../mappers/pagination_mapper');
const container = require('../loaders/register');
const upload = require('../middleware/storage');
const { BookBodyMapper } = require('../mappers/body_mapper');
const { GenreBodyMapper } = require('../mappers/body_mapper');
const { PublisherBodyMapper } = require('../mappers/body_mapper');

const { bookService } = container.cradle;
const { publisherService } = container.cradle;
const { authorService } = container.cradle;
const { userService } = container.cradle;
const { genreService } = container.cradle;
const { orderService } = container.cradle;
const { bookController } = container.cradle;

router.get('/', hasAdminRole, (req, res) => {
  res.render('admin/index', {
    template: './partials/dashboard',
  });
});

router.get('/users', hasAdminRole, (req, res) => {
  const { page, perPage } = PaginationMapper.fromRequest(req);
  return userService.getPage(page, perPage, { _id: 1 }).then((data) => {
    console.log(data.users);
    res.render('admin/index', {
      template: './partials/users',
      session: req.session,
      message: '',
      users: data.users,
      ...data.users,
    });
  });
});

router.get('/users/:userid', hasAdminRole, (req, res) => {
  const userId = req.params.userid;
  const aggregate = [
    {
      $match: {
        userid: userId,
      },
    },
    {
      $addFields: {
        orderID: { $toString: '$_id' },
      },
    },
    {
      $project: {
        userid: 1,
        orderID: 1,
        subtotal: 1,
        total: 1,
        order_at: 1,
      },
    },
    {
      $set: {
        userid: { $toObjectId: '$userid' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userid',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $project: {
        user: { $first: '$user' },
        orderID: 1,
        order_at: 1,
        subtotal: 1,
        total: 1,
        order_at: 1,
      },
    },
    {
      $set: {
        user: '$user.username',
      },
    },
  ];
  return Order.aggregate(aggregate)
    .then((order) => {
      console.log(order);
      if (order) {
        res.render('admin/index', {
          template: './partials/order_history',
          orders: order,
        });
      } else {
        res.status(404).render('error', { message: 'Not Found', error: { status: 404 } });
      }
    }).catch((err) => {
      console.log(err);
    });
});

router.get('/authors', hasAdminRole, (req, res) => {
  const { page, perPage } = PaginationMapper.fromRequest(req);
  return authorService.getPage(page, perPage, { _id: 1 }).then((data) => {
    res.render('admin/index', {
      template: './partials/authors',
      author: data.author,
    });
  });
});

router.post('/author', hasAdminRole, (req, res) => new AuthorModel({
  fullname: req.body.fullname,
  date_of_birth: req.body.date_of_birth,
  phonenumber: req.body.phonenumber,
  address: req.body.address,
}).save()
  .then((_) => {
    res.redirect('/admin/authors');
  }).catch((err) => {
    console.error(err);
  }));

router.post('/author/:authorId', hasAdminRole, (req, res) => {
  const { authorId } = req.params;
  authorService.update(authorId, req.body)
    .then((_) => {
      res.redirect('/admin/authors');
    }).catch((err) => {
      console.error(err);
    });
});

router.get('/publishers', hasAdminRole, (req, res) => {
  const { page, perPage } = PaginationMapper.fromRequest(req);
  return publisherService.getPage(page, perPage, { _id: 1 }).then((data) => {
    res.render('admin/index', {
      template: './partials/publishers',
      message: '',
      publisher: data.publisher,
    });
  });
});

router.post('/publisher', hasAdminRole, (req, res) => {
  console.log(req.body);
  const publishereBody = PublisherBodyMapper.fromRequest(req);
  console.log(publishereBody);
  return publisherService.create(publishereBody)
    .then((newPublisher) => {
      if (newPublisher) {
        return res.redirect('/admin/publishers');
      }
      console.error('Create publisher failed');
    }).catch(console.error);
});

router.post('/publisher/:publisherId', hasAdminRole, (req, res) => {
  const { publisherId } = req.params;
  publisherService.update(publisherId, req.body)
    .then((_) => {
      res.redirect('/admin/publishers');
    }).catch((err) => {
      console.error(err);
    });
});

router.get('/genre', hasAdminRole, (req, res) => {
  const { page, perPage } = PaginationMapper.fromRequest(req);
  return genreService.getPage(page, perPage, { _id: 1 }).then((data) => {
    res.render('admin/index', {
      template: './partials/genre',
      message: '',
      genre: data.user,
    });
  });
});

router.post('/genre', hasAdminRole, (req, res) => {
  const genreBody = GenreBodyMapper.fromRequest(req);
  return genreService.create(genreBody)
    .then((newGenre) => {
      if (newGenre) {
        return res.redirect('/admin/genre');
      }
      console.error('Create Genre failed');
    }).catch(console.error);
});

router.post('/genre/:genreId', hasAdminRole, (req, res) => {
  const { genreId } = req.params;
  genreService.update(genreId, req.body)
    .then((_) => {
      res.status(200).redirect('/admin/genre');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render('error', { message: 'Server Error', error: { status: 500 } });
    });
});

router.get('/books', hasAdminRole, (req, res) => {
  const { page, perPage } = PaginationMapper.fromRequest(req);
  return bookService.getPage(page, perPage, { _id: 1 }).then((data) => {
    console.log(data.book);
    res.render('admin/index', {
      template: './partials/books',
      message: '',
      ...data,
    });
  });
});

router.post('/book', [hasAdminRole, upload.single('upload')], (req, res) => {
  const bookBody = BookBodyMapper.fromRequest(req);
  return bookService.create(bookBody)
    .then((newBook) => {
      if (newBook) {
        return res.redirect('/admin/books');
      }
      console.error('Create book failed');
    }).catch(console.error);
});

router.post('/books/:bookId', hasAdminRole, (req, res) => {
  const page = '/admin/books';
  bookController.update(req, res, page);
});

router.post('/books/:bookId/delete', hasAdminRole, (req, res) => {
  bookService.delete(req.params.bookId)
    .then((_) => {
      res.status(200).redirect('/admin/books');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render('error', { message: 'Server Error', error: { status: 500 } });
    });
});

router.get('/orders', hasAdminRole, (req, res) => {
  let page = req.query
  let perPage = 4
  let count = 100
  console.log(req.params.userid)
  Order.find({})
  .then((order) => {
    console.log(order)
    if(order){
      res.render('admin/index', {
        template: './partials/orders',
        orders: order,
        current: page,
        pages: Math.ceil(count / perPage),
        pre: Math.max(Math.min(page - 1, Math.ceil(count / perPage)), 1),
        next: Math.min(page + 1, Math.ceil(count / perPage)),
      })
    }
    else {
      res.status(404).render('error', {message:'Not Found', error:{status:404}})
    }
    
    }).catch(err => {
      console.log(err);
    })
})

module.exports = router;
