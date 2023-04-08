const express = require('express');

// config setup
require('dotenv').config();
require('./services/database')();

// init server
const app = express();

// json enable
app.use(express.json());

// Database setup
//require('./seeds/');
require('./subscribers/index');

//routes
app.use('/', require('./routes/index'));
app.use('/image', require('./routes/image'));

module.exports = app;
