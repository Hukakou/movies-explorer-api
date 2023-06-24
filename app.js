/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const router = require('./routes/router');
const catchErrorsMiddleware = require('./middlewares/catchErrors');
const { apiRateLimiter } = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, mongodbURL } = process.env;

const app = express();
app.use(cors());
app.use(helmet());
app.use(apiRateLimiter);
app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(auth);
app.use(errorLogger);
app.use(errors());
app.use(catchErrorsMiddleware);

mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, (err) => {
  // eslint-disable-next-line no-unused-expressions
  err ? console.log(err) : console.log(`App listening on ${PORT}`);
});
