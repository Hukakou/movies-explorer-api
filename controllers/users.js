require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const {
  handleError,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../constants/constants');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      }
      res.status(HTTP_STATUS_OK)
        .send(user);
    })
    .catch((err) => handleError(err, next));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          const noPassword = user.toObject({ useProjection: true });
          res.status(HTTP_STATUS_CREATED).send(noPassword);
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с указанным e-mail уже существует'));
          }
          return handleError(err, next);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Неправильные почта или пароль.'));
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );

          return res.send({ token });
        });
    })

    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw NotFoundError('Пользователь не найден');
      }
      res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => handleError(err, next));
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
};
