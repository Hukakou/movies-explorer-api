const http2 = require('node:http2');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
} = http2.constants;

// console.log(http2.constants); // Все статусы

const handleError = (err, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return next(new BadRequestError('Передан некорректный id'));
  }
  if (err.name === 'DocumentNotFoundError') {
    return next(new NotFoundError('Данные с указанным id не найдены.'));
  }
  if (err.code === 11000) {
    return next(new ConflictError('Пользователь с такой почтой уже зарегестрирован.'));
  }
  return next(err);
};

module.exports = {
  handleError,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
};
