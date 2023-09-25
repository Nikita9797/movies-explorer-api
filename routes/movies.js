const router = require('express').Router();
const { moviePostValidation, validatorConfig } = require('../utils/validation');
const {
  createMovie,
  getMovies,
  deleteMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', moviePostValidation, createMovie);
router.delete('/:movieId', validatorConfig, deleteMovieById);

module.exports = router;
