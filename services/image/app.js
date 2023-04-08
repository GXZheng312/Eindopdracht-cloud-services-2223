const express = require('express');
const { initMQ } = require('./services/rabbitmq');

// config setup
require('dotenv').config();
require('./services/database')();

// init server
const app = express();

// json enable
app.use(express.json());

// static files enable
app.use(express.static('public'));

initMQ(() => require('./subscribers'))

//routes
app.use('/', require('./routes/index'));
app.use('/images', require('./routes/image'));

module.exports = app;
