const usersRouter = require('express').Router();
const {
  getUser,
  updateUser,
} = require('../controllers/users');

const { updateUserJoi } = require('../middlewares/celebrate');

usersRouter.get('/me', getUser);
usersRouter.patch('/me', updateUserJoi, updateUser);

module.exports = usersRouter;
