const indexRouter = require('./index');
const usersRouter = require('./users');
const authRouter = require('./auth');
const bookRouter = require('./books');
const cartRouter = require("./cart");
const adminRouter = require('./admin');

const routes = (app) => {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With, content-type, x-access-token, authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.removeHeader('X-Powered-By');
    next();
  });

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/books', bookRouter);
  app.use('/cart', cartRouter);
  app.use('/admin', adminRouter);
};

module.exports = routes;
