const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const ServerError = require('../errors/ServerError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;

  return bcrypt.hash(req.body.password, 10)
    .then((hash) => UserModel.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(httpConstants.HTTP_STATUS_CREATED).send({
      name,
      email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError(err.message));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Данный email уже занят'));
      }
      return next(new ServerError('Server Error'));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
        Domain: 'http://localhost:3000',
      }).send({ token });
    })
    .catch((err) => next(new UnauthorizedError(err.message)));
};

const getCurrentUserInfo = (req, res, next) => UserModel.findById(req.user._id)
  .orFail()
  .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
  .catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError('User not found'));
    }
    return next(new ServerError('Server Error'));
  });

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  return UserModel.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('User not found'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError({
          message: `${Object.values(err.errors)
            .map(() => err.message)
            .join(', ')}`,
        }));
      }
      return next(new ServerError('Server Error'));
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUserInfo,
  updateUser,
};
