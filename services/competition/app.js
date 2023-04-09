const express = require('express');
const bodyParser = require('body-parser');
const { initMQ } = require('./services/rabbitmq');

// config setup
require('dotenv').config();
require('./services/database')();

// init server
const app = express();
app.use(bodyParser.json());

// json enable
app.use(express.json());

initMQ(() => {});//() => require('./subscribers'))

//routes
app.use('/user-image', require('./routes/userimage'));
app.use('/target-image', require('./routes/targetimage'));

module.exports = app;
