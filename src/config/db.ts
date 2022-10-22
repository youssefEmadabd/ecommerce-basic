import mongoose from 'mongoose';

import { config } from './config';
import logger from './logger';

import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false,
};

const promise = mongoose
  .connect(config.mongodbUrl, connectOptions)
  .then((con) => {
    logger.info('Connected to MongoDB');
    return con;
  })
  .catch((error) => logger.error(error));

export default promise;
