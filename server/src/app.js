const express = require('express');
const morgan = require('morgan');

const ledgers = require('./api/ledgers');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('dev'));

app.use('/api/ledgers', ledgers);

module.exports = app;
