const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const {
  createUser,
  login,
} = require('../controllers/users');
const { createUserJoi, loginJoi } = require('../middlewares/celebrate');

router.post('/signin', loginJoi, login);
router.post('/signup', createUserJoi, createUser);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('/*', (req, res, next) => next(new NotFoundError('Запись не найдена')));

module.exports = router;
