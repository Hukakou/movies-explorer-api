const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { createMoviesJoi, checkMoviesIdJoi } = require('../middlewares/celebrate');

router.get('/', getMovies);
router.post('/', createMoviesJoi, createMovie);
router.delete('/:_id', checkMoviesIdJoi, deleteMovie);

module.exports = router;
