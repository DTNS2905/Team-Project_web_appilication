const winston = require('winston');
const path = require('path');
const config = require('../config');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'book-store-service', time: new Date().toISOString() },
  transports: [
    // - Write to all logs with level `info` and below to `app.log`
    // - Write all logs error (and below) to `error.log`.
    new winston.transports.File({ filename: path.join(config.logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(config.logDir, 'app.log') }),
  ],
});

module.exports = logger;
