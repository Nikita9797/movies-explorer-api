const { celebrate, Joi } = require('celebrate');
const { validateId } = require('./validateId');
const { regexUrl } = require('./regexUrl');

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUnValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
    password: Joi.string().required(),
  }),
});

const userPatchValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const moviePostValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexUrl),
    trailerLink: Joi.string().required().regex(regexUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(regexUrl),
    movieId: Joi.number().required(),
  }),
});

const validatorConfig = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().custom(validateId),
  }),
});

module.exports = {
  signInValidation,
  signUnValidation,
  userPatchValidation,
  moviePostValidation,
  validatorConfig,
};
