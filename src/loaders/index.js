/**
 * Module dependencies.
 */
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const mongoStore = require('connect-mongo');
const session = require('express-session');
const logger = require('../utils/logger');
const config = require('../config');
const routes = require('../routes/router');
const normalizePort = require('../utils/port');

class AppLoader {
  constructor() {
    const app = express();

    // Setup error handling, this must be after all other middleware
    app.use(AppLoader.errorHandler);

    const srcDir = path.basename(path.dirname(__dirname));
    const baseDir = path.basename(path.dirname(srcDir));

    // Serve static content
    app.use(express.static(path.join(baseDir, config.static)));

    // view engine setup

    app.set('views', path.join(baseDir, config.view));
    app.set('view engine', config.viewEngine);

    // Set up middleware
    app.use(morgan('dev'));
    app.use(compression());
    app.use(express.urlencoded({ extended: false, limit: '20mb' }));

    // Set up session
    app.use(cookieParser());
    app.use(
      session({
        secret: config.sessionSecrete,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        store: mongoStore.create({
          mongoUrl: config.dbUrl,
          touchAfter: 24 * 3600,
          dbName: 'test',
          mongoOptions: '',
          autoRemove: 'native', // Default
        }),
      }),
    );

    app.use(require('express-status-monitor')({
      title: 'Bookstore Status',
      path: '/admin/monitor',
      healthChecks: [
        {
          protocol: 'http',
          host: 'localhost',
          path: '/',
          port: config.port,
        },
        {
          protocol: 'http',
          host: 'localhost',
          path: '/books',
          port: config.port,
        },
        {
          protocol: 'http',
          host: 'localhost',
          path: '/admin',
          port: config.port,
        },
        {
          protocol: 'http',
          host: 'localhost',
          path: '/admin/books',
          port: config.port,
        },
        {
          protocol: 'http',
          host: 'localhost',
          path: '/admin/publishers',
          port: config.port,
        },
        {
          protocol: 'http',
          host: 'localhost',
          path: '/admin/genre',
          port: config.port,
        },
        {
          protocol: 'http',
          host: 'localhost',
          path: '/admin/authors',
          port: config.port,
        },
        {
          protocol: 'http',
          host: 'localhost',
          path: '/admin/users',
          port: config.port,
        },
        {
          protocol: 'http',
          host: 'localhost',
          path: '/admin/oders',
          port: config.port,
        },
      ],
    }));

    // Dependency injection

    if (app.get('env') === 'production') {
      app.set('trust proxy', 1); // trust first proxy
      session.Cookie.secure = true; // serve secure cookies
    }

    // Pass app to routes
    routes(app);

    // Create HTTP server.
    this.server = http.createServer(app);

    // Start application
    const port = normalizePort(config.port);
    this.server.listen(port, "0.0.0.0");
    this.server.on('error', AppLoader.onError);
    this.server.on('listening', AppLoader.onListening);
  }

  get Server() {
    return this.server;
  }

  /**
     * @description Default error handler to be used with express
     * @param error Error object
     * @param req {object} Express req object
     * @param res {object} Express res object
     * @param next {function} Express next object
     * @returns {*}
     */
  static errorHandler(error, req, res, next) {
    let parsedError;

    // Attempt to gracefully parse error object
    try {
      if (error && typeof error === 'object') {
        parsedError = JSON.stringify(error);
      } else {
        parsedError = error;
      }
    } catch (e) {
      logger.error(e);
    }

    // Log the original error
    logger.error(parsedError);

    // If response is already sent, don't attempt to respond to client
    if (res.headersSent) {
      return next(error);
    }

    res.status(400).json({
      success: false,
      error,
    });
  }

  /**
     * Event listener for HTTP server "error" event.
     */

  static onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);

      default:
        throw error;
    }
  }

  /**
     * Event listener for HTTP server "listening" event.
     */

  static onListening() {
    logger.info(`Express running, now listening on port ${config.port}`);
  }
}

module.exports = AppLoader;
