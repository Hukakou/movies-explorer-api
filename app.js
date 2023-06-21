const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const { createUserJoi, loginJoi } = require('./middlewares/celebrate');
const auth = require('./middlewares/auth');
const router = require('./routes/router');
const {
  createUser,
  login,
} = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const mongodbURL = 'mongodb://0.0.0.0:27017/bitfilmsdb';

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.post('/signin', loginJoi, login);
app.post('/signup', createUserJoi, createUser);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use((error, request, res, next) => {
  const {
    status = 500,
    message,
  } = error;
  res.status(status)
    .send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

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
