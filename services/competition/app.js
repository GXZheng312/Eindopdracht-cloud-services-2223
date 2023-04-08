const express = require('express');
const bodyParser = require('body-parser');

// config setup
require('dotenv').config();
require('./services/database')();

// init server
const app = express();
app.use(bodyParser.json());

// json enable
app.use(express.json());

// Database setup
//require('./seeds/');

//routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));
app.use('/image', require('./routes/image'));
app.use('/targetimage', require('./routes/targetimage'));

module.exports = app;
