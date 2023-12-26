const config = require('./src/config');
const mongoose = require('mongoose');
const logger = require('./src/utils/logger');

mongoose.Promise = global.Promise;

// Connect to the DB an initialize the app if successful
mongoose.connect(config.dbUrl)
  .then(() => {
    logger.info('Database connection successful');

    // Create express instance to setup API
    const AppLoader = require('./src/loaders');
    new AppLoader();
  })
  .catch(err => {
    //eslint-disable-next-line
    console.error(err);
    logger.error(err);
  });
