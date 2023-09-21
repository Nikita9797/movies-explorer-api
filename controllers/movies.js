const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const movieSchema = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  return movieSchema.create({ ...req.body, owner: ownerId })
    .then((card) => res.status(httpConstants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
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

const getCards = (req, res, next) => {
  const owner = req.user._id;
  movieSchema.find({ owner })
    .then((cards) => {
      if (cards.length) {
        return res.status(httpConstants.HTTP_STATUS_OK).send(cards);
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send('Cохранённых фильмов не найдено');
    })
    .catch(() => next(new ServerError('Server Error')));
};

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;

  return movieSchema.findById(movieId)
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return movieSchema.findByIdAndRemove(movieId)
          .then((deletedMovie) => res.status(httpConstants.HTTP_STATUS_OK).send(deletedMovie))
          .catch(() => next(new ServerError('Server Error')));
      }
      return next(new ForbiddenError('Данный фильм отсутствует в списке сохраненных у текущего пользователя'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Card not found'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Incorrect data'));
      }
      return next(new ServerError('Server Error'));
    });
};

module.exports = {
  createMovie,
  getCards,
  deleteMovieById,
};
