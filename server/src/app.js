const express = require('express');
const morgan = require('morgan');

const ledgers = require('./api/ledgers');
const AppError = require('./errors/AppError');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('dev'));

app.use('/api/ledgers', ledgers);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).end();
  }

  res.status(500).json({ error: err.message });
});

module.exports = app;
