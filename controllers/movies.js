const Movie = require('../models/movies');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  handleError,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../constants/constants');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;

  Movie.findById(req.params._id)
    .orFail()
    .then((movie) => {
      const ownerId = movie.owner.toString();
      if (ownerId !== userId) {
        return next(new ForbiddenError('Не знаю как так, но вы пытаетесь удалить чужую корзину фильмов'));
      }
      return movie;
    })
    .then((movie) => Movie.deleteOne(movie))
    .then((movie) => res.status(HTTP_STATUS_OK).send(movie))
    .catch((err) => handleError(err, next));
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
