require('dotenv').config();

const config = {
  dbUrl: process.env.MONGO_URI || 'mongodb://localhost/test-db',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'dev',
  logDir: process.env.LOGDIR || 'logs',
  view: process.env.VIEW || 'views',
  static: process.env.STATIC || 'public',
  viewEngine: process.env.VIEW_ENGINE || 'ejs',
  uploadStorage: process.env.UPLOAD_STORAGE || 'public/images/books',
  sessionSecrete: process.env.SESSION_SECRETE || 'test_session',
};

module.exports = config;
