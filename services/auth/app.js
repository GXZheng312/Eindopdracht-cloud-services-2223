const express = require('express');
const { initMQ } = require('./services/rabbitmq');

// config setup
require('dotenv').config();
require('./services/database')();

// init server
const app = express();

// json enable
app.use(express.json());

// Database setup
//require('./seeds/');

// MQ
initMQ(() => {})

//routes
app.use('/', require('./routes/index'));
app.use('/authtoken', require('./routes/authtoken'));

module.exports = app;
