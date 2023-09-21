const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
  message: 'Слишком много учетных записей создано с этого IP',
});

module.exports = { limiter };
