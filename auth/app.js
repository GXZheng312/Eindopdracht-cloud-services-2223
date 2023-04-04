const express = require('express');

const app = express();

require('dotenv').config();
require('./services/database')();

require('./models/role');
require('./models/user');
require('./models/authToken');

require('./seeds/seeder');

module.exports = app;