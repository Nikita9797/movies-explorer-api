const router = require('express').Router();
const { moviePostValidation, validatorConfig } = require('../utils/validation');
const {
  createMovie,
  getCards,
  deleteMovieById,
} = require('../controllers/movies');

router.get('/', getCards);
router.post('/', moviePostValidation, createMovie);
router.delete('/:movieId', validatorConfig, deleteMovieById);

module.exports = router;
