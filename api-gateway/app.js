const express = require('express');

// config setup
require('dotenv').config();

// init server
const app = express();

// json enable
app.use(express.json());

//routes
app.use('/', require('./routes/index'));

module.exports = app;
