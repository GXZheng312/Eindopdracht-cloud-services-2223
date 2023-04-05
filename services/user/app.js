const express = require('express');

// config setup
require('dotenv').config();
require('./services/database')();

// init server
const app = express();

// Database setup
require('./models/user');
require('./models/role');
require('./seeds/');

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

module.exports = app;
