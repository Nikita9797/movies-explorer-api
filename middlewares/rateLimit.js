const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 500,
  message: 'Слишком много учетных записей создано с этого IP',
});

module.exports = { limiter };
