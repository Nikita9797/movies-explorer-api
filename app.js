const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const { limiter } = require('./middlewares/rateLimit');
const { MONGODB_LINK } = require('./utils/config');
const cors = require('cors');

const { PORT = 3000, MONGODB_URL = MONGODB_LINK } = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3001',
      'http://api.diplomcohort-66.nomoredomainsrocks.ru',
      'https://api.diplomcohort-66.nomoredomainsrocks.ru',
      'http://diplomcohort-66.nomoredom.nomoredomainsrocks.ru',
      'https://diplomcohort-66.nomoredom.nomoredomainsrocks.ru',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT);
