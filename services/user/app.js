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
require('./models/user');
require('./models/role');
require('./seeds/');

// MQ
initMQ(() => require('./subscribers'))

//routes
app.use('/user', require('./routes/users'));
app.use('/login', require('./routes/login'));
app.use('/role', require('./routes/role'));

module.exports = app;
